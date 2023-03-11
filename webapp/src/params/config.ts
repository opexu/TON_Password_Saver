import type { Url } from "url"

export interface IConfig {
    MAINNET: IConfigParams,
    TESTNET: IConfigParams,
}

interface IConfigParams {
    CONTRACT_ADDRESS: string,
    END_POINT: string,
    SEND_COINS: string,
    GET_METHOD_NAME: string,
}

export const CONFIG: IConfig = {
    MAINNET: {
        CONTRACT_ADDRESS: "",
        END_POINT: "https://toncenter.com/api/v2/jsonRPC",
        SEND_COINS: "10000000", // 0.01 TON
        GET_METHOD_NAME: ""
    },
    TESTNET: {
        CONTRACT_ADDRESS: "EQCqCn9osM5-9jJWWDPnEZDatJ79NtKCjceKs3Xwey7APa4L",
        END_POINT: "https://testnet.toncenter.com/api/v2/jsonRPC",
        SEND_COINS: "100000000", // 0.1 TON
        GET_METHOD_NAME: "get_salt"
    }
}