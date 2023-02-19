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

        const passwordSaver = blockchain.openContract(
            PasswordSaver.createFromConfig(
                {
                    id: 0,
                    salt: Buffer.alloc(32).fill('Hello'),
                    pass: Buffer.alloc(32).fill('Pass'),
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

        const startSalt = "Hello";
        const startPass = "Pass";

        const passwordSaver = blockchain.openContract(
            PasswordSaver.createFromConfig(
                {
                    id: 0,
                    salt: Buffer.alloc(32).fill( startSalt ),
                    pass: Buffer.alloc(32).fill( startPass ),
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
        const getBufferString = getBuffer.toString();
        console.log('Данные после деплоя:', getBufferString);


        /////////////////////////////////////

        const newSalt = "Pizda";
        const newPass = "Nahuy";

        const increaseResult = await passwordSaver.sendSalt(increaser.getSender(), {
            salt: Buffer.alloc(32).fill( newSalt ),
            pass: Buffer.alloc(32).fill( newPass ),
            value: toNano('0.05'),
        });

        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: passwordSaver.address,
            success: true,
        });

        const getNewBuffer = await passwordSaver.getSalt();
        const getNewBufferString = getNewBuffer.toString();

        console.log('Данные после изменения:', getNewBufferString);

        expect(newPass).toBe(getNewBufferString);
    });
});
