import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './main.css';

const app = createApp( App );

app.use(createPinia());

app.mount( '#app' );

import App from '@/App.vue';