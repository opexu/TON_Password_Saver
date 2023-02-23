import TonConnect, { type Wallet, type WalletInfo, type WalletInfoRemote } from '@tonconnect/sdk';
import { isWalletInfoInjected, type WalletInfoInjected } from '@tonconnect/sdk';

export enum ConnectionStatus {
    DISABLE,
    ENABLE,
    WAIT
}

interface IConnection {
    status: ConnectionStatus;
    initConnection(): void;
}

export class WalletConnection implements IConnection {
    
    private _connector: TonConnect;
    private _status: ConnectionStatus;

    constructor(){
        this._status = ConnectionStatus.DISABLE;
        this._connector = new TonConnect({ manifestUrl: 'https://github.com/opexu/TON_Password_Saver/blob/main/webapp/src/tonconnect-manifest.json'});    
        this._connector.onStatusChange( this._onStatusChange.bind( this ) );
    }

    get status(){ return this._status; }
    set status( status: ConnectionStatus ){ this._status = status }

    private _onStatusChange( wallet: Wallet | null ){
        console.log('status change', wallet);

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
            this._connector.connect({
                universalLink: bridgeWallet.universalLink,
                bridgeUrl: bridgeWallet.bridgeUrl,
            })
        }
        else{
            console.warn('no available wallets');
        }
    }
}