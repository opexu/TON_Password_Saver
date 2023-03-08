import { defineStore } from 'pinia'
import { SCREEN } from '@/_interfaces/screen';

import { ConnectionStatus } from '@/scripts/WalletConnection';

const useTONStore = defineStore('TONStore', {
    state: () => {
        return {
            screenState: SCREEN.WALLET,
            connectionStatus: ConnectionStatus.DISABLE,
            deepLink: "",
            isTransactionSended: false
        }
    },
    actions: {

        async changeScreen( screenState: SCREEN ){
            this.screenState = screenState;
        },

        async connectWallet(){},
        async disconnectWallet(){},

        async getPassword( pin: string ){},
        async savePassword( pin: string, password: string ){},
    },
    getters: {
        getScreen: ( state ) => ( state.screenState ),
        getStatus: ( state ) => ( state.connectionStatus ),
        getDeepLink: ( state ) => ( state.deepLink ),
        getIsTransactionSended: ( state ) => ( state.isTransactionSended ),
    },
})

export { useTONStore };