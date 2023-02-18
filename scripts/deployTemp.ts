import { toNano } from 'ton-core';
import { Temp } from '../wrappers/Temp';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const temp = Temp.createFromConfig(
        {
            id: Math.floor(Math.random() * 10000),
            counter: 0,
        },
        await compile('Temp')
    );

    await provider.deploy(temp, toNano('0.05'));

    const openedContract = provider.open(temp);

    console.log('ID', await openedContract.getID());
}
