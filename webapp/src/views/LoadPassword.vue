<template>
<div class="w-full h-full flex flex-col">
<form autocomplete="off" enctype="multipart/form-data" method="post" class="space-y-8">
    
    <!-- ПИН -->
    <div class="w-full h-full flex flex-col">
        <label for="pin" class="w-full h-fit">{{ LANG.PASSWORD_LOADER.PIN_LABEL[Locale] }}</label>
        <div class="w-full h-fit flex flex-row space-x-4">
            <input id="pin" ref="pin" 
            type="text" 
            autocomplete="new-password" 
            class="w-full h-fit p-4 border rounded-md bg-inherit focus-visible:outline-none focus-visible:border-blue-600"
            v-model="pin"
            @input="onPinInput"
            />
        </div>
        <div class="w-full h-auto relative">
            <p v-if="!isPinValid" class=" text-red-500">{{ LANG.PASSWORD_LOADER.PIN_HELPER[Locale] }}</p>
        </div>
    </div>

    <div class="w-full h-full flex flex-col">
        <button type="button" class="w-full h-fit p-4 mt-4 border rounded-md [&:not([disabled])]:active:bg-blue-800 disabled:border-slate-600 disabled:text-slate-600"
        :disabled="!isPinValid || approveInProcess"
        @click="getTransaction"
        >
            {{ LANG.PASSWORD_LOADER.APPROVE_BTN_TEXT[Locale] }}
        </button>
    </div>
</form>
</div>
</template>

<script lang="ts"> 
import { defineComponent, type PropType } from 'vue';
import type { Language } from '@/params/language';
import { mapActions } from 'pinia';
import { useTONStore } from '@/store/store';

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
        isPinValid: false,
        pin: "",
        approveInProcess: false,
    }
},
methods: {
    ...mapActions( useTONStore, ['getPassword']),
    onPinInput(){

        const numbersPattern = /[0-9]/g;

        this.isPinValid =
            this.validate( this.pin, numbersPattern ) &&
            this.pin.length > 4
    },
    validate( str: string, pattern: RegExp ): boolean {
        if( str.match( pattern ) ) return true;
        return false;
    },
    async getTransaction(){
        if( !this.isPinValid ) return;
        if( this.approveInProcess ) return;
        
        console.log('get request to blockchain');

        this.approveInProcess = true;

        try {
            
            this.getPassword( this.pin );
            
        } catch( error ) {
            console.warn('error', error);
        } finally {
            this.approveInProcess = false;
        }
    }
}
});
</script>