<template>
<div class="w-full h-full p-4 flex flex-col">
<form autocomplete="off" enctype="multipart/form-data" method="post" class="space-y-8">
    
    <!-- ПИН -->
    <div class="w-full h-full flex flex-col">
        <label for="pin" class="w-full h-fit">{{ LANG.PASSWORD_SAVER.PIN_LABEL[Locale] }}</label>
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
            <p v-if="!isPinValid" class="absolute top-0 text-red-500">{{ LANG.PASSWORD_SAVER.PIN_HELPER[Locale] }}</p>
        </div>
    </div>

    <!-- ПАРОЛЬ -->
    <div class="w-full h-full flex flex-col">
        <label for="pass" class="w-full h-fit">{{ LANG.PASSWORD_SAVER.PASS_LABEL[Locale] }}</label>
        <div class="w-full h-fit flex flex-row space-x-4">
            <input id="pass" ref="pass" 
            :type="isPasswordShown ? 'text' : 'password'" autocomplete="new-password" 
            class="w-full h-fit p-4 border rounded-md bg-inherit focus:outline-none focus-visible:border-blue-600"
            v-model="password"
            @input="onPasswordInput"
            />
            <button type="button" class="w-16 min-w-fit h-fit p-4 border rounded-md"
            @click="isPasswordShown = !isPasswordShown"
            >
                <svg v-if="isPasswordShown" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path fill="white" d="M480 736q75 0 127.5-52.5T660 556q0-75-52.5-127.5T480 376q-75 0-127.5 52.5T300 556q0 75 52.5 127.5T480 736Zm0-72q-45 0-76.5-31.5T372 556q0-45 31.5-76.5T480 448q45 0 76.5 31.5T588 556q0 45-31.5 76.5T480 664Zm0 192q-146 0-266-81.5T40 556q54-137 174-218.5T480 256q146 0 266 81.5T920 556q-54 137-174 218.5T480 856Zm0-300Zm0 220q113 0 207.5-59.5T832 556q-50-101-144.5-160.5T480 336q-113 0-207.5 59.5T128 556q50 101 144.5 160.5T480 776Z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path fill="white" d="m644 628-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660 556q0 20-4 37.5T644 628Zm128 126-58-56q38-29 67.5-63.5T832 556q-50-101-143.5-160.5T480 336q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920 556q-23 59-60.5 109.5T772 754Zm20 246L624 834q-35 11-70.5 16.5T480 856q-151 0-269-83.5T40 556q21-53 53-98.5t73-81.5L56 264l56-56 736 736-56 56ZM222 432q-29 26-53 57t-41 67q50 101 143.5 160.5T480 776q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300 556q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>
            </button>
        </div>
        <div class="w-full h-auto relative">
            <p v-if="!isPasswordValid" class="absolute top-0 text-red-500">{{ LANG.PASSWORD_SAVER.PASS_HELPER[Locale] }}</p>
        </div>
    </div>

    <div class="w-full h-full flex flex-col">
        <button type="button" class="w-full h-fit p-4 mt-4 border rounded-md [&:not([disabled])]:active:bg-blue-800 disabled:border-slate-600 disabled:text-slate-600"
        :disabled="!isPinValid || !isPasswordValid || approveInProcess"
        @click="approveTransaction"
        >
            {{ LANG.PASSWORD_SAVER.APPROVE_BTN_TEXT[Locale] }}
        </button>
    </div>
</form>
</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Language } from '@/params/language';

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
        isPasswordShown: false,
        isPasswordValid: false,
        isPinValid: false,
        pin: "",
        password: "",
        approveInProcess: false,
    }
},
methods: {
    onPinInput(){

        const numbersPattern = /[0-9]/g;

        this.isPinValid =
            this.validate( this.pin, numbersPattern ) &&
            this.pin.length > 4
    },
    onPasswordInput(){
        console.log('navigator.language: ', navigator.language);
        const lowerCaseLettersPattern = /[a-z]/g;
        const upperCaseLettersPattern = /[A-Z]/g;
        const numbersPattern = /[0-9]/g;

        this.isPasswordValid = 
            this.validate( this.password, lowerCaseLettersPattern ) &&
            this.validate( this.password, upperCaseLettersPattern ) &&
            this.validate( this.password, numbersPattern ) &&
            this.password.length > 4
    },
    validate( str: string, pattern: RegExp ): boolean {
        if( str.match( pattern ) ) return true;
        return false;
    },
    async approveTransaction(){
        if( !this.isPinValid || !this.isPasswordValid ) return;
        if( this.approveInProcess ) return;
        
        console.log('try approve');

        this.approveInProcess = true;

        try {
            // TODO APPROVE
            await new Promise(( resolve, reject ) => {
                setTimeout(()=>{
                    resolve( true );
                }, 2000);
            });
            
        } catch( error ) {
            console.warn('error', error);
        } finally {
            this.approveInProcess = false;
        }
    }
}
});
</script>