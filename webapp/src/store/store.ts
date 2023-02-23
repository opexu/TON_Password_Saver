import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SCREEN } from '@/_interfaces/screen';

import { WalletConnection } from '@/scripts/WalletConnection';

const useTONStore = defineStore('TONStore', {
    state: () => {
        return {
            connection: new WalletConnection(),
            screenState: SCREEN.WALLET,
            isWalletConnected: false,
        }
    },
    actions: {
        async changeScreen( screenState: SCREEN ){
            this.screenState = screenState;
        },
        async connectWallet(){
            const walletStatus = true;
            const wallets = await this.connection.getWallets();
            console.log('wallets', wallets);
            this.isWalletConnected = walletStatus;
        },
        async disconnectWallet(){
            const walletStatus = false;
            this.isWalletConnected = walletStatus;
        }
    },
    getters: {
        getScreen( state ){
            return state.screenState;
        },
        getWalletStatus( state ){
            return state.isWalletConnected;
        }
    }
})

export { useTONStore };