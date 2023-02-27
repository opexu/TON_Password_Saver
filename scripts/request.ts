import * as fs from "fs";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, Cell, WalletContractV4, toNano, WalletContractV3R2, WalletContractV3R1, Address } from "ton";
import { PasswordSaver } from "../wrappers/PasswordSaver"; // this is the interface class from step 7
import { mnemonic } from "../config/config";
async function request() {
    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    // prepare Counter's initial code and data cells for deployment
    // const passwordSaverCode = Cell.fromBoc(fs.readFileSync("Password_Saver.cell"))[0]; // compilation output from step 6

    // const passwordSaver = PasswordSaver.createForDeploy(
    //     passwordSaverCode,
    //     {
    //         id: 0,
    //         salt: Buffer.from("Hello"),
    //         saltByteLength: 5,
    //         pass: Buffer.from("Pass"),
    //         passByteLength: 4,
    //         value: toNano('0.05'),
    //     }
    // );

    // exit if contract is already deployed
    // console.log("contract address:", passwordSaver.address.toString());
    // if (await client.isContractDeployed(passwordSaver.address)) {
    //     return console.log("Counter already deployed");
    // }

    // // open wallet v4 (notice the correct wallet version here)
    // const key = await mnemonicToWalletKey(mnemonic.split(" "));
    // const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    // console.log(wallet.address);

    // if (!await client.isContractDeployed(wallet.address)) {
    //     return console.log("wallet is not deployed");
    // }
    // open wallet and read the current seqno of the wallet
    //const walletContract = client.open(wallet);
    //const walletSender = walletContract.sender(key.secretKey);
    //const seqno = await walletContract.getSeqno();

    // send the deploy transaction
    //const passwordSaverContract = client.open(passwordSaver);
    //await passwordSaverContract.sendDeploy(walletSender,BigInt(1));
    const ps_address = Address.parse("EQDb7Cez-o_jFCN5MJcFhBEsqWU7tynQJFBIL3uhmjX-J8_d")
    const ps = new PasswordSaver(ps_address);
    const current_ps = client.open(ps);
    const getNewSalt = await current_ps.getSalt();
    const parcedSalt = getNewSalt.asSlice();  //.beginParse();
    const id = parcedSalt.loadUint(32);
    const sb = parcedSalt.loadUint(8);
    const pb = parcedSalt.loadUint(8);
    const salt = parcedSalt.loadBuffer(sb / 8).toString();
    const pass = parcedSalt.loadBuffer(pb / 8).toString();
    console.log('Данные после изменения:', getNewSalt, parcedSalt, id, sb, pb, salt, pass)//, pb, salt, pass);
    // wait until confirmed
    // let currentSeqno = seqno;
    // while (currentSeqno == seqno) {
    //     console.log("waiting for deploy transaction to confirm...");
    //     await sleep(1500);
    //     currentSeqno = await walletContract.getSeqno();
    // }
    // console.log("deploy transaction confirmed!");
}

request();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
