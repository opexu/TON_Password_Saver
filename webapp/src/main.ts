import { createApp } from 'vue';
import { createPinia, type PiniaPluginContext } from 'pinia';
import { WalletConnection } from './scripts/WalletConnection';
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
            case 'getPassword': {
                connection.getPassword( action.args[0] );
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

    connection.isTransactionSendChanged = ( value ) => {
        obj.store.isTransactionSended = value;
    }

    connection.disconnect();
    //connection.restoreConnection();
});

app.use( pinia );

app.mount( '#app' );
