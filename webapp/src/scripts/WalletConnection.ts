import TonConnect, { type Wallet, type WalletInfo, type WalletInfoRemote } from '@tonconnect/sdk';
import { isWalletInfoInjected, type WalletInfoInjected } from '@tonconnect/sdk';
// import { Event, EventEmitter, type IEventEmitter } from './EventEmitter';

export enum ConnectionStatus {
    DISABLE,
    ENABLE,
    WAIT
}

interface IConnection {
    // eventEmitter: IEventEmitter;
    status: ConnectionStatus;
    deepLink: string;
    initConnection(): void;
    disconnect(): void;
}

export class WalletConnection implements IConnection {
    
    private readonly _connector: TonConnect;
    private _status: ConnectionStatus;
    private _deepLink: string;

    constructor(){
        console.log("Start");

        this._deepLink = "";
        this._status = ConnectionStatus.DISABLE;
        this._connector = new TonConnect({ manifestUrl: 'https://raw.githubusercontent.com/opexu/TON_Password_Saver/main/webapp/src/tonconnect-manifest.json'});    
        this._connector.onStatusChange( this.onStatusChange );
        // this._connector.onStatusChange( ( wallet: Wallet | null ) => {
        //     console.log('status change', wallet);
        //     this.status = ConnectionStatus.ENABLE;
        // });
    }

    get deepLink(){ return this._deepLink; }
    get status(){ return this._status; }
    set status( status: ConnectionStatus ){ this._status = status }

    public onStatusChange( wallet: Wallet | null ){
        // console.log('status change', wallet);
        setTimeout(()=>{
            console.log('status change', wallet);
            console.log('this', this);
            this._status = ConnectionStatus.ENABLE;
        },2000)
    }

    public async initConnection(){
        console.log('initConnection');
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

            // setTimeout(()=>{
            //     this.onStatusChange( null );
            // }, 2000)
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