import { Blockchain } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Temp } from '../wrappers/Temp';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Temp', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Temp');
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const temp = blockchain.openContract(
            Temp.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await temp.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: temp.address,
            deploy: true,
        });
    });

    it('should increase counter', async () => {
        const blockchain = await Blockchain.create();

        const temp = blockchain.openContract(
            Temp.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await temp.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: temp.address,
            deploy: true,
        });

        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await temp.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);

            const increaseResult = await temp.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: temp.address,
                success: true,
            });

            const counterAfter = await temp.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});
