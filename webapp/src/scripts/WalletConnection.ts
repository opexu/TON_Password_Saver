import TonConnect, { type WalletInfo } from '@tonconnect/sdk';
import manifest from '@/tonconnect-manifest.json';

export class WalletConnection {
    
    private _connector: TonConnect;
    private _manifest = manifest;
    
    constructor(){
        this._connector = new TonConnect();
    }

    async getWallets(): Promise<WalletInfo[]> {
        return await this._connector.getWallets();
    }
}