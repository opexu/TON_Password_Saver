<template>
<div class="w-full h-full p-4 flex flex-col space-y-4">
    
    <button class="w-full h-fit p-4 border rounded-md"
    v-if="getWalletStatus() == false"
    @click="connectWallet"
    >{{ LANG.WALLET.CONNECT_BTN_LABEL[Locale] }}</button>

    <button class="w-full h-fit p-4 border rounded-md"
    v-else
    @click="disconnectWallet"
    >{{ LANG.WALLET.DISCONNECT_BTN_LABEL[Locale] }}</button>

</div>
</template>

<script lang="ts">
import type { Language } from '@/params/language';
import { defineComponent, type PropType } from 'vue';
import { useTONStore } from '@/store/store';
import { mapActions, mapState } from 'pinia';

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

    }
},
methods:{
    ...mapState( useTONStore, ['getWalletStatus'] ),
    ...mapActions( useTONStore, ['connectWallet', 'disconnectWallet']),
}
})
</script>