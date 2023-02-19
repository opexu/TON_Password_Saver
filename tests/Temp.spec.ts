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

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const salt = Buffer.from('Hello');
        const saltBitsLength = salt.byteLength;
        const pass = Buffer.from('Pass');
        const passBitsLength = pass.byteLength;

        const passwordSaver = blockchain.openContract(
            PasswordSaver.createFromConfig(
                {
                    id: 0,
                    salt: salt,
                    saltBitsLength: saltBitsLength,
                    pass: pass,
                    passBitsLength: passBitsLength
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
    });

    it('should change salt', async () => {
        const blockchain = await Blockchain.create();

        const startSalt = Buffer.from('Hello');
        const startSaltBitsLength = startSalt.byteLength;
        const startPass = Buffer.from('Pass');
        const startPassBitsLength = startPass.byteLength;

        const passwordSaver = blockchain.openContract(
            PasswordSaver.createFromConfig(
                {
                    id: 0,
                    salt: startSalt,
                    saltBitsLength: startSaltBitsLength,
                    pass: startPass,
                    passBitsLength: startPassBitsLength
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

        const getBuffer = await passwordSaver.getSalt();
        console.log('Данные после деплоя:', getBuffer);


        /////////////////////////////////////

        const newSalt = Buffer.from('pizda');
        const newSaltBitsLength = newSalt.byteLength;
        const newPass = Buffer.from('nahuy');
        const newPassBitsLength = newPass.byteLength;

        const increaseResult = await passwordSaver.sendSalt(increaser.getSender(), {
            salt: newSalt,
            saltBitsLength: newSaltBitsLength,
            pass: newPass,
            passBitsLength: newPassBitsLength,
            value: toNano('0.05'),
        });

        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: passwordSaver.address,
            success: true,
        });

        const getNewSalt = await passwordSaver.getSalt();
        console.log('Данные после изменения:', getNewSalt);

        expect(newSalt).toBe(getNewSalt);
    });
});
