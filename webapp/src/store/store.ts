import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SCREEN } from '@/_interfaces/screen';

const useTONStore = defineStore('TONStore', {
    state: () => {
        return {
            screenState: SCREEN.MAIN,
        }
    },
    actions: {
        async changeScreen( screenState: SCREEN ){
            this.screenState = screenState;
        },
    },
    getters: {
        getScreen( state ){
            return state.screenState;
        }
    }
})

export { useTONStore };