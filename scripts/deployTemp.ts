import { toNano } from 'ton-core';
import { PasswordSaver } from '../wrappers/PasswordSaver';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    
    const salt = Buffer.from("");
    const saltBitsLength = salt.byteLength;
    const pass = Buffer.from("");
    const passBitsLength = pass.byteLength;
    
    const temp = PasswordSaver.createFromConfig(
        {
            id: Date.now(),
            salt: salt,
            saltBitsLength: saltBitsLength,
            pass: pass,
            passBitsLength: passBitsLength,
        },
        await compile('Temp')
    );

    await provider.deploy(temp, toNano('0.05'));

    const openedContract = provider.open(temp);

    console.log('ID', await openedContract.getID());
}
