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

    it('should change salt', async () => {
        console.log(" ~~~~~~~~~~~ CHANGE SALT ~~~~~~~~~~~ ")
        
        const blockchain = await Blockchain.create();

        const startSalt = Buffer.from('Hello');
        const startsaltByteLength = startSalt.byteLength;
        const startPass = Buffer.from('Pass');
        const startpassByteLength = startPass.byteLength;

        const passwordSaver = blockchain.openContract(
            PasswordSaver.createFromConfig(
                {
                    id: 556677881,
                    salt: startSalt,
                    saltByteLength: startsaltByteLength,
                    pass: startPass,
                    passByteLength: startpassByteLength,
                    value: toNano('0.1'),
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await passwordSaver.sendDeploy(deployer.getSender(), toNano('0.1'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: passwordSaver.address,
            deploy: true,
        });

        /**
         * РАССКОММЕНТИРОВАТЬ, ЧТОБЫ ПОСМОТРЕТЬ РЕЗУЛЬТАТ ТРАНЗАКЦИИ
         */
        //console.log(deployResult.transactions);

        const increaser = await blockchain.treasury('salter');

        const tupleArr = [
            [ "One", "_One_" ],
            [ "Two", "_Two_" ],
            [ "Three", "_Three_" ],
            [ "Four", "_Four_" ],
            [ "Five", "_Five_" ],
            [ "Six", "_Six_" ],
            [ "Seven", "_Seven_" ],
            [ "Eight", "_Eight_" ],
            [ "Nine", "_Nine_" ],
            [ "Ten", "_Ten_" ],
        ];

        for (let i = 0; i < tupleArr.length; i++) {

            const salt = Buffer.from(tupleArr[i][0]);
            const pass = Buffer.from(tupleArr[i][1]);

            const increaseResult = await passwordSaver.sendSalt(increaser.getSender(), {
                salt: salt,
                saltByteLength: salt.byteLength,
                pass: pass,
                passByteLength: pass.byteLength,
                value: toNano('0.1'),
            });

            // expect(increaseResult.transactions).toHaveTransaction({
            //     from: increaser.address,
            //     to: passwordSaver.address,
            //     success: true,
            // });

        }

        const tupleIndex = Math.floor(Math.random() * tupleArr.length);
        const tupleSalt = tupleArr[tupleIndex][0];
        const expectedPass = tupleArr[tupleIndex][1];

        const getNewSalt = await passwordSaver.getSalt(tupleSalt);
        const parcedSalt = getNewSalt.asSlice();
        const saltUint = parcedSalt.loadUint(8);
        const pass = parcedSalt.loadBuffer(saltUint / 8).toString();
        console.log('Сообщение GET из контракта:', pass);

        expect(pass).toBe(expectedPass);
    });
});
