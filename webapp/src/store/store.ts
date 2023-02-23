import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SCREEN } from '@/_interfaces/screen';

import { ConnectionStatus, WalletConnection } from '@/scripts/WalletConnection';

const useTONStore = defineStore('TONStore', {
    state: () => {
        
        const _connection = new WalletConnection();

        return {
            connection: _connection,
            screenState: SCREEN.WALLET,
        }
    },
    actions: {
        async changeScreen( screenState: SCREEN ){
            this.screenState = screenState;
        },
        async connectWallet(){
            this.connection.initConnection();
        },
        async disconnectWallet(){
            const walletStatus = false;
        },
    },
    getters: {
        getScreen( state ){
            return state.screenState;
        },
        getStatus( state ){
            return state.connection.status;
        },
        getDeepLink( state ){
            return state.connection.deepLink;
        },
    }
})

export { useTONStore };