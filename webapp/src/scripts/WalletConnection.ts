import TonConnect, { type WalletInfo } from '@tonconnect/sdk';

export class WalletConnection {
    
    private _connector: TonConnect;

    constructor(){
        this._connector = new TonConnect({ manifestUrl: 'https://github.com/opexu/TON_Password_Saver/blob/main/webapp/src/tonconnect-manifest.json'});
    }

    async getWallets(): Promise<WalletInfo[]> {
        return await this._connector.getWallets();
    }
}