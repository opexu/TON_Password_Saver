import { Blockchain } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { PasswordSaver } from '../wrappers/PasswordSaver';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('PasswordSaver', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('PasswordSaver');
    });

    // it('should deploy', async () => {
    //     console.log(" ~~~~~~~~~~~ SHOULD DEPLOY ~~~~~~~~~~~ ")
    //     const blockchain = await Blockchain.create();

    //     const salt = Buffer.from('Hello');
    //     const saltByteLength = salt.byteLength;
    //     console.log('deploy saltByteLength: ', saltByteLength);
    //     const pass = Buffer.from('Pass');
    //     const passByteLength = pass.byteLength;
    //     console.log('deploy passByteLength: ', passByteLength);

    //     const passwordSaver = blockchain.openContract(
    //         PasswordSaver.createFromConfig(
    //             {
    //                 id: 0,
    //                 salt: salt,
    //                 saltByteLength: saltByteLength,
    //                 pass: pass,
    //                 passByteLength: passByteLength,
    //                 value: toNano('0.05'),
    //             },
    //             code
    //         )
    //     );

    //     const deployer = await blockchain.treasury('deployer');

    //     const deployResult = await passwordSaver.sendDeploy(deployer.getSender(), toNano('0.05'));

    //     expect(deployResult.transactions).toHaveTransaction({
    //         from: deployer.address,
    //         to: passwordSaver.address,
    //         deploy: true,
    //     });
    // });

    it('should change salt', async () => {
        console.log(" ~~~~~~~~~~~ CHANGE SALT ~~~~~~~~~~~ ")
        const blockchain = await Blockchain.create();

        const startSalt = Buffer.from('Hello');
        const startsaltByteLength = startSalt.byteLength;
        console.log('salt startsaltByteLength: ', startsaltByteLength)
        const startPass = Buffer.from('Pass');
        const startpassByteLength = startPass.byteLength;
        console.log('salt startpassByteLength: ', startpassByteLength)

        const passwordSaver = blockchain.openContract(
            PasswordSaver.createFromConfig(
                {
                    id: 0,
                    salt: startSalt,
                    saltByteLength: startsaltByteLength,
                    pass: startPass,
                    passByteLength: startpassByteLength,
                    value: toNano('0.05'),
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await passwordSaver.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: passwordSaver.address,
            deploy: true,
        });

        const increaser = await blockchain.treasury('salter');

        // const getBuffer = await passwordSaver.getSalt();
        // console.log('Данные после деплоя:', getBuffer);


        /////////////////////////////////////

        const newSalt = Buffer.from('RazDvaTri');
        const newsaltByteLength = newSalt.byteLength;
        console.log('change newsaltByteLength: ', newsaltByteLength)
        const newPass = Buffer.from('Chetire');
        const newpassByteLength = newPass.byteLength;
        console.log('change newpassByteLength: ', newpassByteLength)

        const increaseResult = await passwordSaver.sendSalt(increaser.getSender(), {
            salt: newSalt,
            saltByteLength: newsaltByteLength,
            pass: newPass,
            passByteLength: newpassByteLength,
            value: toNano('0.05'),
        });

        // expect(increaseResult.transactions).toHaveTransaction({
        //     from: increaser.address,
        //     to: passwordSaver.address,
        //     success: true,
        // });

        const getNewSalt = await passwordSaver.getSalt();
        console.log('Данные после изменения:', getNewSalt);
        //const bin = getNewSalt.toString(2);
        const buf = getNewSalt.toString();
        console.log('buf1:', newSalt);
        console.log('buf2:', buf);
        expect(newSalt).toBe(getNewSalt);
    });
});
