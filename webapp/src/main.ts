import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { WalletConnection } from './scripts/WalletConnection';
import App from '@/App.vue';

import './main.css';

const app = createApp( App );

const pinia = createPinia();
app.use( pinia );

app.mount( '#app' );
