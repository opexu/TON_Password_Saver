<template>
<div class="w-full h-full flex flex-col">
    <TonConnect
        :Locale="Locale"
        :LANG="LANG"
    ></TonConnect>
    <Main
        :Locale="Locale"
        :LANG="LANG"
        @load-pass="setScreen"
        @save-pass="setScreen"
        v-if="getStatus() === ConnectionStatus.ENABLE"
    ></Main>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Main from '@/views/Main.vue';
import TonConnect from '@/views/TonConnect.vue';
import { SCREEN } from '@/_interfaces/screen';
import { useTONStore } from '@/store/store';
import { mapActions, mapState } from 'pinia';
import { LANG } from '@/params/language';
import { ConnectionStatus } from '@/scripts/WalletConnection';

export default defineComponent({
data: () => {
    return {
        SCREEN: SCREEN,
        LANG: LANG,
        Locale: "en-EN",
        ConnectionStatus: ConnectionStatus,
    }
},
created() {
    if( navigator?.language === "ru-RU" ) this.Locale = "ru-RU";
},
methods: {
    ...mapState( useTONStore, ['getScreen', 'getStatus'] ),
    ...mapActions( useTONStore, ['changeScreen']),
    setScreen( value: SCREEN ){
        this.changeScreen( value );
    }
},
components: { Main, TonConnect },
});
</script>