interface Language {
    [key: string]: {
        [key: string]: {
            [key: string]: string
        }
    }
}

const LANG: Language = {
    
    WALLET: {
        
        CONNECT_BTN_LABEL: {
            "ru-RU": "Подключить кошелек TonKeeper",
            "en-EN": "Connect TonKeeper Wallet",
        },

        DISCONNECT_BTN_LABEL: {
            "ru-RU": "Отключить кошелек TonKeeper",
            "en-EN": "Disconnect TonKeeper Wallet",
        }
    },

    MAIN: {

        GET_BTN_LABEL: {
            "ru-RU": "Получить пароль",
            "en-EN": "Get Password",
        }
    },

    PASSWORD_SAVER: {

        PIN_LABEL: {
            "ru-RU": "Введите любой ПИН, чтобы получить этот пароль в дальнейшем ( ПИН необходимо запомнить )",
            "en-EN": "Enter any PIN to get that password later ( you need remember it )",
        },
        
        PIN_HELPER: {
            "ru-RU": "Минимум: 4 латинских символа, 1 нижнего регистра, 1 число",
            "en-EN": "Minimum: 4 en characters, 1 lowercase letter, 1 number",
        },
        
        PASS_LABEL: {
            "ru-RU": "Введите любой пароль",
            "en-EN": "Enter any password",
        },
        
        PASS_HELPER: {
            "ru-RU": "Минимум: 8 латинских символов, 1 нижнего регистра, 1 символ верхнего регистра, 1 число",
            "en-EN": "Minimum: 8 en characters, 1 uppercase letter, 1 lowercase letter, 1 number",
        },
        
        APPROVE_BTN_TEXT: {
            "ru-RU": "Подтвердить транзакцию TON кошельком",
            "en-EN": "Approve by TON wallet",
        },
        
        APPROVE_OK_MESSAGE: {
            "ru-RU": "Транзакция успешно проведена",
            "en-EN": "Transaction approved",
        },
        
        APPROVE_WAIT_MESSAGE: {
            "ru-RU": "Ожидание транзакции...",
            "en-EN": "Wait transaction...",
        },
        
        APPROVE_ERROR_MESSAGE: {
            "ru-RU": "Ошибка транзакции",
            "en-EN": "Transaction Error",
        },
    },

    PASSWORD_LOADER: {
        
        PIN_LABEL: {
            "ru-RU": "Введите ПИН, который вводили при отправке пароля",
            "en-EN": "Enter the PIN that you entered when submitting your password",
        },

        PIN_HELPER: {
            "ru-RU": "Минимум: 4 латинских символа, 1 нижнего регистра, 1 число",
            "en-EN": "Minimum: 4 en characters, 1 lowercase letter, 1 number",
        },

        APPROVE_BTN_TEXT: {
            "ru-RU": "Подтвердить транзакцию TON кошельком",
            "en-EN": "Approve by TON wallet",
        },
        
        APPROVE_OK_MESSAGE: {
            "ru-RU": "Транзакция успешно проведена",
            "en-EN": "Transaction approved",
        },
        
        APPROVE_WAIT_MESSAGE: {
            "ru-RU": "Ожидание транзакции...",
            "en-EN": "Wait transaction...",
        },
        
        APPROVE_ERROR_MESSAGE: {
            "ru-RU": "Ошибка транзакции",
            "en-EN": "Transaction Error",
        },
    },
}

export type { Language }
export { LANG }