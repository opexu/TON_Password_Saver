import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type PasswordSaverConfig = {
    id: number;
    salt: Buffer;
    pass: Buffer;
};

export function PasswordSaverConfigToCell(config: PasswordSaverConfig): Cell {
    return beginCell()
        .storeUint(config.id, 32)
        .storeBuffer(config.salt, 32)
        .storeBuffer(config.pass, 32)
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
            pass: Buffer;
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                //.storeUint(opts.queryID ?? 0, 64)
                .storeBuffer(opts.salt, 32)
                .storeBuffer(opts.pass, 32)
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
