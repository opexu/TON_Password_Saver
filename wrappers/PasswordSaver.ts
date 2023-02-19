import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type PasswordSaverConfig = {
    id: number;
    salt: Buffer;
    saltBitsLength: number;
    pass: Buffer;
    passBitsLength: number;
};

export function PasswordSaverConfigToCell(config: PasswordSaverConfig): Cell {
    return beginCell()
        .storeUint( config.id, 32 )
        .storeUint( config.saltBitsLength * 8, 8 )
        .storeUint( config.passBitsLength * 8, 8 )
        .storeBuffer( config.salt )
        .storeBuffer( config.pass )
        .endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class PasswordSaver implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new PasswordSaver(address);
    }

    static createFromConfig(config: PasswordSaverConfig, code: Cell, workchain = 0) {
        const data = PasswordSaverConfigToCell(config);
        const init = { code, data };
        return new PasswordSaver(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }

    async sendSalt(
        provider: ContractProvider,
        via: Sender,
        opts: {
            salt: Buffer;
            saltBitsLength: number;
            pass: Buffer;
            passBitsLength: number;
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell()
                .storeUint( Opcodes.increase, 32 )
                .storeUint( opts.saltBitsLength * 8, 8 )
                .storeUint( opts.passBitsLength * 8, 8 )
                .storeBuffer( opts.salt )
                .storeBuffer( opts.pass )
                .endCell(),
        });
    }

    async getSalt(provider: ContractProvider) {
        const result = await provider.get('get_salt', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}
