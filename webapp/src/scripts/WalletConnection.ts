import TonConnect, { type Wallet, type WalletInfo, type WalletInfoRemote } from '@tonconnect/sdk';
import { isWalletInfoInjected, type WalletInfoInjected } from '@tonconnect/sdk';

export enum ConnectionStatus {
    DISABLE,
    ENABLE,
    WAIT
}

interface IConnection {
    status: ConnectionStatus;
    deepLink: string;
    initConnection(): void;
    disconnect(): void;
}

export class WalletConnection implements IConnection {
    
    private _connector: TonConnect;
    private _status: ConnectionStatus;
    private _deepLink: string;

    constructor(){
        this._deepLink = "";
        this._status = ConnectionStatus.DISABLE;
        this._connector = new TonConnect({ manifestUrl: 'https://raw.githubusercontent.com/opexu/TON_Password_Saver/main/webapp/src/tonconnect-manifest.json'});    
        this._connector.onStatusChange( this._onStatusChange.bind( this ) );

        //this._connector.restoreConnection();
    }
    get deepLink(){ return this._deepLink; }
    get status(){ return this._status; }
    set status( status: ConnectionStatus ){ this._status = status }

    private _onStatusChange( wallet: Wallet | null ){
        console.log('status change', wallet);
        this.status = ConnectionStatus.ENABLE;
    }

    public async initConnection(){
        console.log('initCOnnection');
        this._status = ConnectionStatus.WAIT;

        const walletsArr = await this._connector.getWallets();
        console.log('walletsArr',walletsArr)
        
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
            this._deepLink = universalLink;
            console.log('universal link', universalLink );
        }
        else{
            console.warn('no available wallets');
        }
    }

    public async disconnect() {
        this._status = ConnectionStatus.WAIT;
        this._connector.disconnect();
    }
}