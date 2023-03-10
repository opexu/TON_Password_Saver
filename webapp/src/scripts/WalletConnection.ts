import { Base64 } from '@tonconnect/protocol';
import TonConnect, { UserRejectsError, isWalletInfoInjected, type WalletInfoInjected, type SendTransactionRequest, type Wallet, type WalletInfoRemote } from '@tonconnect/sdk';
import TonWeb from "tonweb";
import { Address, beginCell, Cell, Slice, TonClient, TupleReader } from 'ton';

import { CONFIG } from '@/params/config';
import type { TupleItemCell, TupleItemSlice } from 'ton-core/dist/tuple/tuple';

export enum ConnectionStatus {
    DISABLE,
    ENABLE,
    WAIT
}

interface IConnection {
    statusChanged?: ( status: ConnectionStatus ) => void;
    deepLinkChanged?: ( deepLink: string ) => void;
    restoreConnection(): void;
    initConnection(): void;
    disconnect(): void;

    saltChanged?: ( salt: string ) => void;
    passwordChanged?: ( password: string ) => void;
}

export class WalletConnection implements IConnection {
    
    public statusChanged?: ( status: ConnectionStatus ) => void
    public deepLinkChanged?: ( deepLink: string ) => void

    public saltChanged?: ( salt: string ) => void
    public passwordChanged?: ( password: string ) => void;
    public receivedPasswordChanged?: ( password: string ) => void;

    public isTransactionSendChanged?: ( value: boolean ) => void;

    private readonly _connector: TonConnect;
    private _status: ConnectionStatus;
    private _deepLink: string;

    private _salt: string;
    private _password: string;
    private _receivedPassword: string;

    private _isTransactionSended: boolean;

    constructor(){

        this._status = ConnectionStatus.DISABLE;
        this._deepLink = "";
        
        this._salt = "";
        this._password = "";
        this._receivedPassword = "";

        this._isTransactionSended = false;

        this._connector = new TonConnect({ manifestUrl: 'https://raw.githubusercontent.com/opexu/TON_Password_Saver/main/webapp/src/tonconnect-manifest.json'});    
        
        this._connector.onStatusChange( this._onStatusChange.bind(this) );

    }

    get status(){ return this._status; };
    set status( status: ConnectionStatus ){
        this._status = status;
        if( this.statusChanged ) this.statusChanged( this._status );
    }

    get deepLink(){ return this._deepLink; };
    set deepLink( deepLink: string ){
        this._deepLink = deepLink;
        if( this.deepLinkChanged ) this.deepLinkChanged( this._deepLink );
    }

    set salt( salt: string ){
        this._salt = salt;
        if( this.saltChanged ) this.saltChanged( this._salt );
    }

    set password( password: string ){
        this._password = password;
        if( this.passwordChanged ) this.passwordChanged( this._password );
    }

    set receivedPassword( password: string ){
        this._receivedPassword = password;
        if( this.receivedPasswordChanged ) this.receivedPasswordChanged( this._receivedPassword );
    }

    set isTransactionSended( value: boolean ){
        this._isTransactionSended = value;
        if( this.isTransactionSendChanged ) this.isTransactionSendChanged( this._isTransactionSended );
    }

    private async _onStatusChange( wallet: Wallet | null ){
        
        if( wallet ){
            if( this.deepLink === "" ){
                const { bridgeWallet } = await this._getTonKeeper();
                this.deepLink = bridgeWallet.universalLink;
            }
        }

        wallet 
            ? this.status = ConnectionStatus.ENABLE
            : this.status = ConnectionStatus.DISABLE
    }

    private async _getTonKeeper(): Promise<{ embeddedWallet: WalletInfoInjected, bridgeWallet: WalletInfoRemote }>{
        const walletsArr = await this._connector.getWallets();

        const embeddedWallet = walletsArr.find( wallet => {
            isWalletInfoInjected( wallet ) && wallet.embedded
        }) as WalletInfoInjected;
        
        const bridgeWallet = walletsArr.find( wallet => {
            return wallet.name === "Tonkeeper";
        }) as WalletInfoRemote;
        
        return {
            embeddedWallet,
            bridgeWallet
        }
    }

    public async restoreConnection(){
        this.status = ConnectionStatus.WAIT;
        this._connector.restoreConnection();
    }

    public async initConnection(){
        this.status = ConnectionStatus.WAIT;

        const { embeddedWallet, bridgeWallet } = await this._getTonKeeper();

        if ( embeddedWallet ) {
            this._connector.connect({ jsBridgeKey: embeddedWallet.jsBridgeKey });
        }
        else if( bridgeWallet ){
            const universalLink = this._connector.connect({
                universalLink: bridgeWallet.universalLink,
                bridgeUrl: bridgeWallet.bridgeUrl,
            })
            this.deepLink = universalLink;
        }
        else{
            console.warn('no available wallets');
        }
    }

    public async disconnect() {
        this.status = ConnectionStatus.WAIT;
        this._connector.disconnect();
    }

    public async getPassword( salt: string ){
        if( !this._connector.connected ) return;

        console.log('salt: ', salt);

        const payload = GenerateGetPayload( salt );

        const tonClient = new TonClient({
            endpoint: CONFIG.TESTNET.END_POINT,
        });

        const address = Address.parse( CONFIG.TESTNET.CONTRACT_ADDRESS );
        
        const stackPayload: TupleItemCell = {
            type: "cell",
            cell: Cell.fromBase64(payload)
        }

        try{
            const { stack } = await tonClient.runMethod( 
                    address,
                    CONFIG.TESTNET.GET_METHOD_NAME,
                    [stackPayload]
                );
            
            const cell = stack.readCell();
            const resultSlice = cell.beginParse();

            const passBits = resultSlice.loadUint(8);
            const passBuffer = resultSlice.loadBuffer( passBits / 8 );
            const pass = passBuffer.toString('utf8');

            this.receivedPassword = pass;
            
        } catch( e ){
            console.log('error', e);
        }
        
    }

    public async savePassword( salt: string, password: string ){
        if( !this._connector.connected ) return;

        console.log('salt: ', salt);
        console.log('password: ', password);

        const payload = await GenerateSendPayload( salt, password );

        const transaction: SendTransactionRequest = {
            validUntil: Math.round( ( Date.now() / 1000 ) + 60 * 60 * 24 ),
            messages: [
                {
                    address: CONFIG.TESTNET.CONTRACT_ADDRESS,
                    amount: CONFIG.TESTNET.SEND_COINS,
                    payload: payload,
                }
            ]
        }

        try {
            this.isTransactionSended = true;

            const result = await this._connector.sendTransaction( transaction );
            console.log('result', result);
            
        } catch ( e ) {
            if( e instanceof UserRejectsError ) {
                console.warn( 'You rejected the transaction. Please confirm it to send to the blockchain', e );
            } 
            else {
                console.warn( 'Unknown error happened', e );
            }
        } finally {
            this.isTransactionSended = false;
        }
    }

}

function GenerateGetPayload( salt: string ): string {

    const saltBuffer = Buffer.from( salt );

    const cell = beginCell()
        .storeUint( saltBuffer.byteLength * 8, 8 )
        .storeBuffer( saltBuffer )
        .endCell();

    const bocString = cell.toBoc().toString('base64');

    return bocString;
}

async function GenerateSendPayload( salt: string, password: string ): Promise<string> {
	
    const op = 0x7e8764ef; // increase
    
    const saltBuffer = Buffer.from( salt );
    const passBuffer = Buffer.from( password );

    const cell = beginCell()
        .storeUint( op, 32 )
        .storeUint( saltBuffer.byteLength * 8, 8)
        .storeUint( passBuffer.byteLength * 8, 8)
        .storeBuffer( saltBuffer )
        .storeBuffer( passBuffer )
        .endCell();

    const bocString = cell.toBoc().toString('base64');

    return bocString;
}