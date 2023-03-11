<template>
<div class="w-full h-full flex flex-col items-center justify-between">
    
    <TonConnect
    :Locale="Locale"
    :LANG="LANG"
    v-if="getStatus() !== ConnectionStatus.ENABLE"
    ></TonConnect>
    
    <Main
    :Locale="Locale"
    :LANG="LANG"
    @load-pass="setScreen"
    @save-pass="setScreen"
    v-if="getStatus() === ConnectionStatus.ENABLE"
    ></Main>

    <a class="p-4 hover:text-blue-800"
    href="https://github.com/opexu/TON_Password_Saver">
    {{ LANG.MAIN.SOURCE_CODE_LABEL[Locale] }}
    </a>
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