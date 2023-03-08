import { Address, beginCell, Builder, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode, Slice, Tuple, TupleItem } from 'ton-core';
import { TupleItemSlice } from 'ton-core/dist/tuple/tuple';

export type DictionaryKeyTypes = Address | number | bigint | Buffer;
export type DictionaryKey<K extends DictionaryKeyTypes> = {
    bits: number;
    serialize(src: K): bigint;
    parse(src: bigint): K;
};
export type DictionaryValue<V> = {
    serialize(src: V, builder: Builder): void;
    parse(src: Slice): V;
};
export type PasswordSaverConfig = {
    id: number;
    salt: Buffer;
    saltByteLength: number;
    pass: Buffer;
    passByteLength: number;
    value: bigint;
};

export function PasswordSaverConfigToCell(config: PasswordSaverConfig): Cell {
    return beginCell()
        .storeUint(config.id, 32)
        .storeUint(config.saltByteLength * 8, 8)
        .storeUint(config.passByteLength * 8, 8)
        .storeBuffer(config.salt)
        .storeBuffer(config.pass)
        .endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class PasswordSaver implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

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

    static createForDeploy(code: Cell, config: PasswordSaverConfig): PasswordSaver {
        const data = PasswordSaverConfigToCell(config)
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new PasswordSaver(address, { code, data });
    }

    async sendSalt(
        provider: ContractProvider,
        via: Sender,
        opts: {
            salt: Buffer;
            saltByteLength: number;
            pass: Buffer;
            passByteLength: number;
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.saltByteLength * 8, 8)
                .storeUint(opts.passByteLength * 8, 8)
                .storeBuffer(opts.salt)
                .storeBuffer(opts.pass)
                .endCell(),
        });
    }

    async getSalt(provider: ContractProvider, args: string ) {
        
        const payload: TupleItemSlice = {
            type: "slice",
            cell: beginCell()
                .storeBuffer( Buffer.from( args ) )
                .endCell(),
        };

        const result = await provider.get('get_salt', [
            payload
        ]);
        //return result.stack.readBigNumber();
        return result.stack.readCell();
        //return result.stack.readString();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}
