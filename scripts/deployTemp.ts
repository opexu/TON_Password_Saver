import { toNano } from 'ton-core';
import { PasswordSaver } from '../wrappers/PasswordSaver';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    
    const salt = Buffer.from("");
    const saltByteLength = salt.byteLength;
    const pass = Buffer.from("");
    const passByteLength = pass.byteLength;
    
    const temp = PasswordSaver.createFromConfig(
        {
            id: Date.now(),
            salt: salt,
            saltByteLength: saltByteLength,
            pass: pass,
            passByteLength: passByteLength,
            value: toNano('0.05'),
        },
        await compile('Temp')
    );

    await provider.deploy(temp, toNano('0.05'));

    const openedContract = provider.open(temp);

    console.log('ID', await openedContract.getID());
}
