import { toNano } from 'ton-core';
import { PasswordSaver } from '../wrappers/PasswordSaver';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const temp = PasswordSaver.createFromConfig(
        {
            id: Date.now(),
            salt: Buffer.from(""),
            pass: Buffer.from(""),
        },
        await compile('Temp')
    );

    await provider.deploy(temp, toNano('0.05'));

    const openedContract = provider.open(temp);

    console.log('ID', await openedContract.getID());
}
