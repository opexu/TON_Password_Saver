import { Base64 } from '@tonconnect/protocol';
import TonConnect, { UserRejectsError, isWalletInfoInjected, type WalletInfoInjected, type SendTransactionRequest, type Wallet, type WalletInfoRemote } from '@tonconnect/sdk';
import TonWeb from "tonweb";

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

    private readonly _connector: TonConnect;
    private _status: ConnectionStatus;
    private _deepLink: string;

    private _salt: string;
    private _password: string;

    constructor(){

        this._status = ConnectionStatus.DISABLE;
        this._deepLink = "";
        
        this._salt = "";
        this._password = "";

        this._connector = new TonConnect({ manifestUrl: 'https://raw.githubusercontent.com/opexu/TON_Password_Saver/main/webapp/src/tonconnect-manifest.json'});    
        
        this._connector.onStatusChange( this._onStatusChange.bind(this) );

    }

    set status( status: ConnectionStatus ){
        this._status = status;
        if( this.statusChanged ) this.statusChanged( this._status );
    }

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

    private _onStatusChange( wallet: Wallet | null ){

        wallet 
            ? this.status = ConnectionStatus.ENABLE
            : this.status = ConnectionStatus.DISABLE
        
    }

    public async restoreConnection(){
        this._connector.restoreConnection();
    }

    public async initConnection(){
        this.status = ConnectionStatus.WAIT;

        const walletsArr = await this._connector.getWallets();
        
        const embeddedWallet = walletsArr.find( wallet => {
            isWalletInfoInjected( wallet ) && wallet.embedded
        }) as WalletInfoInjected;
        
        const bridgeWallet = walletsArr.find( wallet => {
            return wallet.name === "Tonkeeper";
        }) as WalletInfoRemote;

        if ( embeddedWallet ) {
            this._connector.connect({ jsBridgeKey: embeddedWallet.jsBridgeKey });
        }
        else if( bridgeWallet ){
            const universalLink = this._connector.connect({
                universalLink: bridgeWallet.universalLink,
                bridgeUrl: bridgeWallet.bridgeUrl,
            })
            this.deepLink = universalLink;

            // TODO REMOVE
            //this.status = ConnectionStatus.ENABLE;
        }
        else{
            console.warn('no available wallets');
        }
    }

    public async disconnect() {
        this.status = ConnectionStatus.WAIT;
        this._connector.disconnect();
    }

    public async getPassword(){

    }

    public async savePassword( salt: string, password: string ){
        if( !this._connector.connected ) return;

        console.log('salt: ', salt);
        console.log('password: ', password);

        const payload = await GeneratePayload( salt, password );

        const transaction: SendTransactionRequest = {
            validUntil: Math.round( ( Date.now() / 1000 ) + 60 * 60 * 24 ),
            messages: [
                {
                    address: "EQDb7Cez-o_jFCN5MJcFhBEsqWU7tynQJFBIL3uhmjX-J8_d",
                    amount: "10000000",
                    //stateInit: "",
                    payload: payload,
                }
            ]
        }

        try {
            const result = await this._connector.sendTransaction( transaction );
            console.log('result', result);
            //const someTxData = await this._connector.getTransaction( result.boc );
            //console.log( 'someTxData: ', someTxData );

        } catch ( e ) {
            if( e instanceof UserRejectsError ) {
                console.warn( 'You rejected the transaction. Please confirm it to send to the blockchain' );
            } 
            else {
                console.warn( 'Unknown error happened', e );
            }
        }
    }

}

async function GeneratePayload( salt: string, password: string ): Promise<string> {
	
    const op = 0x7e8764ef; // increase
	//const quiryId = 0; // not used
    const saltBuffer = new TextEncoder().encode( salt );
    const saltByteLength = saltBuffer.byteLength;
    const passBuffer = new TextEncoder().encode( password );
    const passByteLength = passBuffer.byteLength;

    const Cell = TonWeb.boc.Cell;
    const cell = new Cell();

    cell.bits.writeUint( op, 32 );
    cell.bits.writeUint( saltByteLength * 8, 8 )
    cell.bits.writeUint( passByteLength * 8, 8 )
    cell.bits.writeString( salt );
    cell.bits.writeString( password );

    const bocBytes = await cell.toBoc();
    const bocString = Base64.encode( bocBytes );
	// const messageBody = beginCell()
	// 	.storeUint( op, 32 )
	// 	.storeUint( saltByteLength * 8, 8 )
	// 	.storeUint( passByteLength * 8, 8 )
    //     .storeSlice()
	// 	.storeBuffer( saltBuffer.buffer )
    //     .storeBuffer( passBuffer.buffer )
    // .endCell();

	//return Base64.encode(messageBody.toBoc());
    return bocString;
}