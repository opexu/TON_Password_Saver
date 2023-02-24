import { defineStore } from 'pinia'
import { SCREEN } from '@/_interfaces/screen';

import { ConnectionStatus, WalletConnection } from '@/scripts/WalletConnection';
import type { Wallet } from '@tonconnect/sdk';
import { reactive } from 'vue';

const useTONStore = defineStore('TONStore', {
    state: () => {
            
        return {
            screenState: SCREEN.WALLET,
            connectionStatus: ConnectionStatus.DISABLE,
            deepLink: "",
        }
    },
    actions: {
        async changeScreen( screenState: SCREEN ){
            this.screenState = screenState;
        },
        async connectWallet(){
            console.log('action connectWallet');
        },
        async disconnectWallet(){
            console.log('action disconnectWallet');
        },
    },
    getters: {
        getScreen( state ){
            return state.screenState;
        },
        getStatus( state ){
            console.log('get status', state.connectionStatus)
            return state.connectionStatus;
        },
        getDeepLink( state ){
            return state.deepLink;
        },
    },
})

export { useTONStore };