<template>
<div class="w-full h-fit p-4 flex flex-col space-y-4">
    
    <!-- КНОПКА ПОДКЛЮЧЕНИЯ КОШЕЛЬКА -->
    <button type="button" class="w-full h-fit p-4 border rounded-md [&:not([disabled])]:active:bg-blue-800 disabled:border-slate-600 disabled:text-slate-600"
    v-if="getStatus() !== ConnectionStatus.ENABLE"
    :disabled="getStatus() === ConnectionStatus.WAIT"
    @click="connectWallet"
    >{{ getStatus() === ConnectionStatus.DISABLE
            ? LANG.WALLET.CONNECT_BTN_LABEL[Locale] 
            : LANG.WALLET.WAIT_BTN_LABEL[Locale] 
    }}</button>

    <!-- DEEP LINK -->
    <a class="w-full h-fit p-4 border rounded-md text-center active:bg-blue-800"
    v-if="getDeepLink() !== '' && getStatus() === ConnectionStatus.WAIT"
    :href="calcDeepLink"
    >{{ LANG.WALLET.LINK_TO_WALLET[Locale] }}</a>

</div>
</template>

<script lang="ts">
import type { Language } from '@/params/language';
import { defineComponent, type PropType } from 'vue';
import { useTONStore } from '@/store/store';
import { mapActions, mapState } from 'pinia';
import { ConnectionStatus } from '@/scripts/WalletConnection';

export default defineComponent({
props: {
    Locale: {
        type: String,
        required: true,
    },
    LANG: {
        type: Object as PropType<Language>,
        required: true,
    }
},
data: () => {
    return {
        ConnectionStatus: ConnectionStatus,
    }
},
methods:{
    ...mapState( useTONStore, ['getStatus', 'getDeepLink'] ),
    ...mapActions( useTONStore, ['connectWallet', 'disconnectWallet']),
},
computed:{
    calcDeepLink(){
        const deepLink = this.getDeepLink();
        return deepLink;
    },
}
})
</script>