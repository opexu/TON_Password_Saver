<template>
<div class="w-full h-full p-4 flex flex-col space-y-4">
    
    <div class="w-full h-full flex flex-row space-x-4">
        
        <!-- КНОПКА ОТКЛЮЧЕНИЯ КОШЕЛЬКА -->
        <button type="button" class="w-16 min-w-fit h-fit p-4 border rounded-md [&:not([disabled])]:active:bg-blue-800 disabled:border-slate-600 disabled:text-slate-600"
        @click="disconnectWallet"
        >x</button>
        
        <button class="w-full h-fit p-4 border rounded-md "
        :class="[ getScreen() === SCREEN.LOAD ? 'bg-blue-800' : '' ]"
        @click="loadPasswordClick"
        >{{ LANG.MAIN.GET_BTN_LABEL[Locale] }}</button>
        
        <button class="w-16 min-w-fit h-fit p-4 border rounded-md "
        :class="[ getScreen() === SCREEN.SAVE ? 'bg-blue-800' : '' ]"
        @click="savePasswordClick"
        >+</button>

    </div>

    <div class="w-full h-full flex flex-row">
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

</div>
</template>
    
<script lang="ts">
import { SCREEN } from '@/_interfaces/screen';
import { defineComponent, type PropType } from 'vue';
import LoadPassword from '@/views/LoadPassword.vue';
import SavePassword from '@/views/SavePassword.vue';
import { useTONStore } from '@/store/store';
import { mapActions, mapState } from 'pinia';
import type { Language } from '@/params/language';

export default defineComponent({
props: {
    LANG: {
        type: Object as PropType<Language>,
        required: true,
    },
    Locale: {
        type: String,
        required: true,
    }
},
data: () => {
    return {
        SCREEN: SCREEN
    }
},
methods: {
    ...mapState( useTONStore, ['getScreen'] ),
    ...mapActions( useTONStore, ['disconnectWallet']),
    loadPasswordClick(){
        this.$emit('load-pass', SCREEN.LOAD);
    },
    savePasswordClick(){
        this.$emit('save-pass', SCREEN.SAVE);
    }
},
components: { LoadPassword, SavePassword }
});
</script>