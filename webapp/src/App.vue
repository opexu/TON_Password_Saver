<template>
<div class="w-full h-full flex flex-col">
    <Main
    :Locale="Locale"
    :LANG="LANG"
    @load-pass="setScreen"
    @save-pass="setScreen"
    ></Main>
    <LoadPassword
    :Locale="Locale"
    :LANG="LANG"
    v-if="getScreen() === SCREEN.LOAD"
    ></LoadPassword>
    <SavePassword
    :Locale="Locale"
    :LANG="LANG"
    v-else-if="getScreen() === SCREEN.SAVE"
    ></SavePassword>
</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import Main from '@/views/Main.vue';
import LoadPassword from './views/LoadPassword.vue';
import SavePassword from './views/SavePassword.vue';
import { SCREEN } from '@/_interfaces/screen';
import { useTONStore } from '@/store/store';
import { mapActions, mapState } from 'pinia';
import { LANG, type Language } from './params/language';

export default defineComponent({
data: () => {
    return {
        SCREEN: SCREEN,
        LANG: LANG,
        Locale: "en-EN"
    }
},
created() {
    if( navigator?.language === "ru-RU" ) this.Locale = "ru-RU";
},
methods: {
    ...mapState( useTONStore, ['getScreen'] ),
    ...mapActions( useTONStore, ['changeScreen']),
    setScreen( value: SCREEN ){
        this.changeScreen( value );
    }
},
components: { Main, LoadPassword, SavePassword },
});
</script>