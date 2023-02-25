import { createApp, markRaw, ref } from 'vue';
import { createPinia, type PiniaPluginContext } from 'pinia';
import { ConnectionStatus, WalletConnection } from './scripts/WalletConnection';
import App from '@/App.vue';

import './main.css';

// import process from "process";
// import { Buffer } from "buffer";
// window.process = process;
// window.Buffer = Buffer;

// declare module 'pinia'{
//     export interface PiniaCustomProperties {
//         connection: WalletConnection;
//     }
// }

const app = createApp( App );
const pinia = createPinia();
const connection = new WalletConnection();

pinia.use(( obj: PiniaPluginContext ) => {

    obj.store.$onAction(( action ) => {
        switch( action.name ){
            case 'connectWallet': {
                connection.initConnection();
                break;
            }
            case 'disconnectWallet': {
                connection.disconnect();
                break;
            }
            case 'getPassword': {
                connection.getPassword();
                break;
            }
            case 'savePassword': {
                connection.savePassword( action.args[0], action.args[1] );
                break;
            }
        }
    });

    connection.statusChanged = ( status ) => {
        obj.store.connectionStatus = status;
    };

    connection.deepLinkChanged = ( deepLink ) => {
        obj.store.deepLink = deepLink;
    }

    connection.restoreConnection();
});

app.use( pinia );

app.mount( '#app' );
