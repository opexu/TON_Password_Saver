import { createApp, markRaw, ref } from 'vue';
import { createPinia, type PiniaPluginContext } from 'pinia';
import { ConnectionStatus, WalletConnection } from './scripts/WalletConnection';
import App from '@/App.vue';

import './main.css';

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
