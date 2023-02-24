import TonConnect, { type Wallet, type WalletInfo, type WalletInfoRemote } from '@tonconnect/sdk';
import { isWalletInfoInjected, type WalletInfoInjected } from '@tonconnect/sdk';
// import { Event, EventEmitter, type IEventEmitter } from './EventEmitter';

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
}

export class WalletConnection implements IConnection {
    
    public statusChanged?: ( status: ConnectionStatus ) => void
    public deepLinkChanged?: ( deepLink: string ) => void

    private readonly _connector: TonConnect;
    private _status: ConnectionStatus;
    private _deepLink: string; 

    constructor(){

        this._deepLink = "";
        this._status = ConnectionStatus.DISABLE;

        this._connector = new TonConnect({ manifestUrl: 'https://raw.githubusercontent.com/opexu/TON_Password_Saver/main/webapp/src/tonconnect-manifest.json'});    
        
        this._connector.onStatusChange( this._onStatusChange.bind(this) );
    
        this._connector
    }

    set status( status: ConnectionStatus ){
        this._status = status;
        if( this.statusChanged ) this.statusChanged( this._status );
    }

    set deepLink( deepLink: string ){
        this._deepLink = deepLink;
        if( this.deepLinkChanged ) this.deepLinkChanged( this._deepLink );
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
        }
        else{
            console.warn('no available wallets');
        }
    }

    public async disconnect() {
        this.status = ConnectionStatus.WAIT;
        this._connector.disconnect();
    }
}