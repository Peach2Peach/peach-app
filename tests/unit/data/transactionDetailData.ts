import {
  Transaction as BDKTransaction,
  BlockTime,
  TransactionDetails,
} from "bdk-rn";
import { Transaction as BitcoinJSTransaction } from "bitcoinjs-lib";

type Props = {
  txid: string;
  hex?: string;
  received: number;
  sent: number;
  fee: number;
  confirmationTime?: { height: number; timestamp: number };
};
export const createTransaction = ({
  txid,
  hex = txid,
  received,
  sent,
  fee,
  confirmationTime,
}: Props) => {
  const blockTime = new BlockTime(
    confirmationTime?.height,
    confirmationTime?.timestamp,
  );
  const transaction = new BDKTransaction();
  const serialized = Array.from(Buffer.from(hex, "hex"));
  transaction.serialize = jest.fn().mockResolvedValue(serialized);
  const txDetails = new TransactionDetails(
    txid,
    received,
    sent,
    fee,
    blockTime,
    transaction,
  );
  return { ...txDetails, transaction };
};
export const genesisTx = createTransaction({
  txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
  sent: 0,
  received: 5000000000,
  fee: 0,
  confirmationTime: { height: 0, timestamp: 1231006505 },
});

export const confirmed1 = createTransaction({
  txid: "txid1_confirmed",
  sent: 1,
  received: 1,
  fee: 1,
  confirmationTime: { height: 1, timestamp: 1 },
});
export const confirmed2 = createTransaction({
  txid: "txid2",
  sent: 2,
  received: 2,
  fee: 2,
  confirmationTime: { height: 2, timestamp: 2 },
});
export const confirmed3 = createTransaction({
  txid: "txid3",
  sent: 3,
  received: 3,
  fee: 3,
  confirmationTime: { height: 3, timestamp: 3 },
});
export const confirmed4 = createTransaction({
  txid: "txid4",
  sent: 0,
  received: 25000,
  fee: 10000,
  confirmationTime: { height: 765432, timestamp: 1234567890 },
});
export const confirmed5 = createTransaction({
  txid: "txid5",
  sent: 0,
  received: 25000,
  fee: 10000,
  confirmationTime: { height: 765432, timestamp: 1234567890 },
});

export const pending1 = createTransaction({
  txid: "txid1",
  sent: 1000,
  received: 100,
  fee: 1,
});
export const pending2 = createTransaction({
  txid: "txid2",
  sent: 2000,
  received: 200,
  fee: 2,
});
export const pending3 = createTransaction({
  txid: "txid3",
  sent: 3000,
  received: 300,
  fee: 3,
});
export const pendingReceived1 = createTransaction({
  txid: "txidreceived3",
  sent: 0,
  received: 3000,
  fee: 3,
});

export const pendingTransactionSummary: TransactionSummary = {
  id: pending1.txid,
  type: "TRADE",
  amount: 900,
  offerData: [
    {
      offerId: "123",
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      amount: 900,
      contractId: undefined,
      currency: undefined,
      price: undefined,
    },
  ],
  date: new Date("2022-09-14T16:14:02.835Z"),
  confirmed: false,
  height: undefined,
};
export const pendingReceivedTransactionSummary: TransactionSummary = {
  ...pendingTransactionSummary,
  id: pendingReceived1.txid,
  height: 1,
};
export const confirmedTransactionSummary: TransactionSummary = {
  ...pendingTransactionSummary,
  id: confirmed1.txid,
  height: 1,
  confirmed: true,
};
export const bitcoinTransaction: Transaction = {
  txid: "credacted",
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: "bredacted",
      vout: 0,
      prevout: {
        scriptpubkey: "5120redacted",
        scriptpubkey_asm: "OP_PUSHNUM_1 OP_PUSHBYTES_32 9a62redacted",
        scriptpubkey_type: "v1_p2tr",
        scriptpubkey_address: "bc1pnf32redacted",
        value: 223667,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: ["0667redacted"],
      is_coinbase: false,
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey: "5120redacted",
      scriptpubkey_asm: "OP_PUSHNUM_1 OP_PUSHBYTES_32 7ba2redacted",
      scriptpubkey_type: "v1_p2tr",
      scriptpubkey_address: "bc1p0w3vredacted",
      value: 173465,
    },
    {
      scriptpubkey: "0020redacted",
      scriptpubkey_asm: "OP_0 OP_PUSHBYTES_32 372dredacted",
      scriptpubkey_type: "v0_p2wsh",
      scriptpubkey_address: "bc1qxukhredacted",
      value: 50000,
    },
  ],
  size: 206,
  weight: 617,
  fee: 202,
  value: 223667,
  status: {
    confirmed: true,
    block_height: 756530,
    block_hash: "redacted1680",
    block_time: 1664622712,
  },
};

export const transactionWithoutRBF1: Transaction = {
  txid: "983eca3c0ad59f1459a93fa893ec9a5610d5abdb0501656dbac803be4a564215",
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: "4a20a5fb2d2bb6ec032109f9fb6da895e6570aed818ec55cbbb450c6af2dc773",
      vout: 0,
      prevout: {
        scriptpubkey: "a9140a5dc8bc7a13f2cd6d68c715e317d418f21e81c187",
        scriptpubkey_asm:
          "OP_HASH160 OP_PUSHBYTES_20 0a5dc8bc7a13f2cd6d68c715e317d418f21e81c1 OP_EQUAL",
        scriptpubkey_type: "p2sh",
        scriptpubkey_address: "32dq2hQBuE3tQbNR2TYHLWXKfXqcTZGsFj",
        value: 1032151,
      },
      scriptsig: "1600142fecca63092f639cb94aa7e60d39d64eb7954c5b",
      scriptsig_asm:
        "OP_PUSHBYTES_22 00142fecca63092f639cb94aa7e60d39d64eb7954c5b",
      witness: [
        "304402202001fcdc349b589f2f4ecb335d535383e68088b47d30074654067f7e3166db7b022067e6224ae87685a085226bb5e827ede445ffa2651c697ec5dcf263520e34b01b01",
        "021d392baf5db1ac77389abce37057a7cff9c55ea78a2347c531dd169a57ebbfb1",
      ],
      is_coinbase: false,
      sequence: 4294967295,
      inner_redeemscript_asm:
        "OP_0 OP_PUSHBYTES_20 2fecca63092f639cb94aa7e60d39d64eb7954c5b",
    },
    {
      txid: "b15589c0906ebce01ecf8ac71e5168f4db8b44c7f4d07afa6b0c4c52945053c2",
      vout: 170,
      prevout: {
        scriptpubkey: "a91400bcc6d503ccc9901fe0f36cf50bcaaebb28f0b587",
        scriptpubkey_asm:
          "OP_HASH160 OP_PUSHBYTES_20 00bcc6d503ccc9901fe0f36cf50bcaaebb28f0b5 OP_EQUAL",
        scriptpubkey_type: "p2sh",
        scriptpubkey_address: "31kv4yg9k4nUM8zGFFECE1U8CP2zNf7mZs",
        value: 332068,
      },
      scriptsig: "16001405975f547907417483fda382ad60898e81af6dcd",
      scriptsig_asm:
        "OP_PUSHBYTES_22 001405975f547907417483fda382ad60898e81af6dcd",
      witness: [
        "3045022100af70d99bb2980da4b9806577cbf5c9d089022de031bb2e21cb6a22ee7cb31c4a02206c57fb7be910cd2252ae12aa064f37c0403ee8695dd201b45b271e52e278162701",
        "0240adf1ac873587c6e6d5ea2fa44a95eb3a50fca97718294a152bfea0955fa265",
      ],
      is_coinbase: false,
      sequence: 4294967295,
      inner_redeemscript_asm:
        "OP_0 OP_PUSHBYTES_20 05975f547907417483fda382ad60898e81af6dcd",
    },
    {
      txid: "42affc96e42c8d42a3599ee70f2ad292eb4592006d920fa11a7b733e0634590b",
      vout: 0,
      prevout: {
        scriptpubkey: "a91497dbc260cb84e0817db98a94ac620957722c6b9d87",
        scriptpubkey_asm:
          "OP_HASH160 OP_PUSHBYTES_20 97dbc260cb84e0817db98a94ac620957722c6b9d OP_EQUAL",
        scriptpubkey_type: "p2sh",
        scriptpubkey_address: "3FXyDeqqgF7fVyZGnJZQQe9tXCisxK9tLt",
        value: 71746,
      },
      scriptsig: "160014c4fc25295248438adccf6b40354bed98f538a269",
      scriptsig_asm:
        "OP_PUSHBYTES_22 0014c4fc25295248438adccf6b40354bed98f538a269",
      witness: [
        "3045022100e785a2603c9e5ea568b0a3d51b015623b32cbdb6f924d6c914fd5c74c8559ca302205879eafa4d4f22ac24ef78a18c3632266e721cdffd7f8fd237b6477ee903cef401",
        "028896594c5f75f2c5c7621dd94042acba3e88a2da31320297cc6aa5e9d9337490",
      ],
      is_coinbase: false,
      sequence: 4294967295,
      inner_redeemscript_asm:
        "OP_0 OP_PUSHBYTES_20 c4fc25295248438adccf6b40354bed98f538a269",
    },
  ],
  vout: [
    {
      scriptpubkey: "a914a7e14412b327e3ffee02c1f817e28fc8ff52619b87",
      scriptpubkey_asm:
        "OP_HASH160 OP_PUSHBYTES_20 a7e14412b327e3ffee02c1f817e28fc8ff52619b OP_EQUAL",
      scriptpubkey_type: "p2sh",
      scriptpubkey_address: "3GzgdL3wgmLtdyeehpB9eiQA8gt5JXzurY",
      value: 143645,
    },
    {
      scriptpubkey: "a91454f99aee545ec4a4d5d27054fb6c0763d0fff61b87",
      scriptpubkey_asm:
        "OP_HASH160 OP_PUSHBYTES_20 54f99aee545ec4a4d5d27054fb6c0763d0fff61b OP_EQUAL",
      scriptpubkey_type: "p2sh",
      scriptpubkey_address: "39SKhXjpAuBxs7crDmpzsmxgsNcJYoiedx",
      value: 1158280,
    },
  ],
  size: 591,
  weight: 1389,
  fee: 134040,
  status: {
    confirmed: true,
    block_height: 796381,
    block_hash:
      "000000000000000000006aa27ca0320bd02d58c04d2c9da923c1bb71574e070d",
    block_time: 1688034471,
  },
};

export const transactionWithoutRBF2: Transaction = {
  txid: "6cc040df39c32750b0ca112697a54b3f3ba35547b2be0aceb0b2b50696849a3c",
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: "ef9437fa37caab9306b70954f97a7f4bfce0bdc1b0a74cf7e213b0b1f9e4a55b",
      vout: 1,
      prevout: {
        scriptpubkey: "0014803b53fc395b14e705658b26fe23715ccc8f72b8",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_20 803b53fc395b14e705658b26fe23715ccc8f72b8",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "bc1qsqa48lpetv2wwpt93vn0ugm3tnxg7u4cjjalen",
        value: 1038972,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "3045022100b386867b6df2c07ee44c882dc51088ca9d9a32768cdf651e74e9aa956a631062022051e4cbd9f6452664100fa6e77b916de0c5dca970135d7b7c03ebbec43256a92801",
        "02043005bac9a26af9d0933a407e1fba4bff958d223a7f73478888fc26e596ab01",
      ],
      is_coinbase: false,
      sequence: 4294967295,
    },
    {
      txid: "fcb268a9fb2e0ba9eb714ea3e9ba0bd33a71db3a181a3cd2c02ddbb97be5f894",
      vout: 1,
      prevout: {
        scriptpubkey: "0014803b53fc395b14e705658b26fe23715ccc8f72b8",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_20 803b53fc395b14e705658b26fe23715ccc8f72b8",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "bc1qsqa48lpetv2wwpt93vn0ugm3tnxg7u4cjjalen",
        value: 995067,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "30440220606a70a0cd4e1e5d5b236e9f9c57d150680d8d9f9e731a1b7876dfb6145e3fa502204687f9c3db4c0da88ef2f89bc665b486fefad87fae2cac8be062ae0b8e2dc77501",
        "02043005bac9a26af9d0933a407e1fba4bff958d223a7f73478888fc26e596ab01",
      ],
      is_coinbase: false,
      sequence: 4294967295,
    },
  ],
  vout: [
    {
      scriptpubkey:
        "51206c09baf41ba57afd229faa252c5d8c122a9613f70c5874625c81e894ef4f2828",
      scriptpubkey_asm:
        "OP_PUSHNUM_1 OP_PUSHBYTES_32 6c09baf41ba57afd229faa252c5d8c122a9613f70c5874625c81e894ef4f2828",
      scriptpubkey_type: "v1_p2tr",
      scriptpubkey_address:
        "bc1pdsym4aqm54a06g5l4gjjchvvzg4fvylhp3v8gcjus85ffm609q5qkj09gr",
      value: 1473300,
    },
    {
      scriptpubkey: "0014803b53fc395b14e705658b26fe23715ccc8f72b8",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 803b53fc395b14e705658b26fe23715ccc8f72b8",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1qsqa48lpetv2wwpt93vn0ugm3tnxg7u4cjjalen",
      value: 557859,
    },
  ],
  size: 383,
  weight: 881,
  fee: 2880,
  status: {
    confirmed: true,
    block_height: 796381,
    block_hash:
      "000000000000000000006aa27ca0320bd02d58c04d2c9da923c1bb71574e070d",
    block_time: 1688034471,
  },
};

export const transactionWithRBF1: Transaction = {
  txid: "053f320d8b9b77c521e8d9e8e7d90692e9c51a38c3d11010069e66b37b5f53d7",
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: "042a36fd44ccc0e2d457da7eb2d605d3b84ff4caf5898ffb1ee969d5dc46ca21",
      vout: 16,
      prevout: {
        scriptpubkey:
          "512022418d48e03d3033eaff5e66d7469ad498e0d2756d82717c146a5e0d70dbfba5",
        scriptpubkey_asm:
          "OP_PUSHNUM_1 OP_PUSHBYTES_32 22418d48e03d3033eaff5e66d7469ad498e0d2756d82717c146a5e0d70dbfba5",
        scriptpubkey_type: "v1_p2tr",
        scriptpubkey_address:
          "bc1pyfqc6j8q85cr86hltendw3566jvwp5n4dkp8zlq5df0q6uxmlwjs9uku9q",
        value: 1870,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "917dd8ba45d226b0184501a3e04a4c74956b7a51b5ea1036cf4044c38fc1d1412c667aefa2b853439e524ff19366977eabd7272367a51a8f4a8c6f6a7d6b49ac",
        "20ced79eadf0f9d301d4053c244d6c53d7b5ed78c89b3a0369e7a782a779361946ac0063036f7264010118746578742f706c61696e3b636861727365743d7574662d38003a7b2270223a226272632d3230222c226f70223a226d696e74222c227469636b223a2273617473222c22616d74223a22313030303030303030227d68",
        "c0ced79eadf0f9d301d4053c244d6c53d7b5ed78c89b3a0369e7a782a779361946",
      ],
      is_coinbase: false,
      sequence: 4261412863,
    },
  ],
  vout: [
    {
      scriptpubkey: "0014f001c49c6e329d6dec2a8922ce44000c46e083d8",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 f001c49c6e329d6dec2a8922ce44000c46e083d8",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1q7qquf8rwx2wkmmp23y3vu3qqp3rwpq7c9d37jk",
      value: 330,
    },
  ],
  size: 313,
  weight: 559,
  fee: 1540,
  status: {
    confirmed: true,
    block_height: 796382,
    block_hash:
      "00000000000000000000d880221955f5d1413bf28edcfd54c22872b19f7ad592",
    block_time: 1688034708,
  },
};
export const transactionWithRBF2: Transaction = {
  txid: "acca7d01838630a811b7c3243d20d592f0c6484ae4c9e979a733a115f8409527",
  version: 2,
  locktime: 796349,
  vin: [
    {
      txid: "8dac84dc4eddf270a4acba5307a326453aad00a4ab9be2c9196cba6060a3b73c",
      vout: 1,
      prevout: {
        scriptpubkey: "76a914a1497911e45ab49c47bf345184e197103450bc0e88ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 a1497911e45ab49c47bf345184e197103450bc0e OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "1Fhooser2NjmuxuhCymYY2s5rncLqFdrej",
        value: 1120273,
      },
      scriptsig:
        "47304402205f0859cf61910d192364fd23567ef445c65e701d7924935087b0805efa44e702022064ae500e11629fde94f11b929b9fa80d31372367a9dc8b7cb22302a5353102a4012103062b2eb9ca2d8e4245b113887c4cb6c37772c36956bd35bba964f0f6ecdcf069",
      scriptsig_asm:
        "OP_PUSHBYTES_71 304402205f0859cf61910d192364fd23567ef445c65e701d7924935087b0805efa44e702022064ae500e11629fde94f11b929b9fa80d31372367a9dc8b7cb22302a5353102a401 OP_PUSHBYTES_33 03062b2eb9ca2d8e4245b113887c4cb6c37772c36956bd35bba964f0f6ecdcf069",
      is_coinbase: false,
      sequence: 4294967293,
    },
  ],
  vout: [
    {
      scriptpubkey: "00145e589380d21a931b70a757e2aa8e0bdda694b1dd",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 5e589380d21a931b70a757e2aa8e0bdda694b1dd",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1qtevf8qxjr2f3ku982l324rstmknffvwavecsdt",
      value: 224269,
    },
    {
      scriptpubkey: "76a9146e7b97bd78027bd0bae060d0409d635092e7a07488ac",
      scriptpubkey_asm:
        "OP_DUP OP_HASH160 OP_PUSHBYTES_20 6e7b97bd78027bd0bae060d0409d635092e7a074 OP_EQUALVERIFY OP_CHECKSIG",
      scriptpubkey_type: "p2pkh",
      scriptpubkey_address: "1B5BPUZGErrCzDPPWc7Hs6vyHW81CmVpdN",
      value: 889715,
    },
  ],
  size: 222,
  weight: 888,
  fee: 6289,
  status: {
    confirmed: true,
    block_height: 796391,
    block_hash:
      "000000000000000000034a8b67ed40a93fe6878986b41a5bb371dfafb9d842b6",
    block_time: 1688039052,
  },
};

export const bitcoinJSTransactionWithoutRBF1 = BitcoinJSTransaction.fromHex(
  "0200000000010373c72dafc650b4bb5cc58e81ed0a57e695a86dfbf9092103ecb62b2dfba5204a00000000171600142fecca63092f639cb94aa7e60d39d64eb7954c5bffffffffc2535094524c0c6bfa7ad0f4c7448bdbf468511ec78acf1ee0bc6e90c08955b1aa0000001716001405975f547907417483fda382ad60898e81af6dcdffffffff0b5934063e737b1aa10f926d009245eb92d22a0fe79e59a3428d2ce496fcaf420000000017160014c4fc25295248438adccf6b40354bed98f538a269ffffffff021d3102000000000017a914a7e14412b327e3ffee02c1f817e28fc8ff52619b8788ac11000000000017a91454f99aee545ec4a4d5d27054fb6c0763d0fff61b870247304402202001fcdc349b589f2f4ecb335d535383e68088b47d30074654067f7e3166db7b022067e6224ae87685a085226bb5e827ede445ffa2651c697ec5dcf263520e34b01b0121021d392baf5db1ac77389abce37057a7cff9c55ea78a2347c531dd169a57ebbfb102483045022100af70d99bb2980da4b9806577cbf5c9d089022de031bb2e21cb6a22ee7cb31c4a02206c57fb7be910cd2252ae12aa064f37c0403ee8695dd201b45b271e52e278162701210240adf1ac873587c6e6d5ea2fa44a95eb3a50fca97718294a152bfea0955fa26502483045022100e785a2603c9e5ea568b0a3d51b015623b32cbdb6f924d6c914fd5c74c8559ca302205879eafa4d4f22ac24ef78a18c3632266e721cdffd7f8fd237b6477ee903cef40121028896594c5f75f2c5c7621dd94042acba3e88a2da31320297cc6aa5e9d933749000000000",
);
export const bitcoinJSTransactionWithoutRBF2 = BitcoinJSTransaction.fromHex(
  "020000000001025ba5e4f9b1b013e2f74ca7b0c1bde0fc4b7f7af95409b70693abca37fa3794ef0100000000ffffffff94f8e57bb9db2dc0d23c1a183adb713ad30bbae9a34e71eba90b2efba968b2fc0100000000ffffffff02147b1600000000002251206c09baf41ba57afd229faa252c5d8c122a9613f70c5874625c81e894ef4f28282383080000000000160014803b53fc395b14e705658b26fe23715ccc8f72b802483045022100b386867b6df2c07ee44c882dc51088ca9d9a32768cdf651e74e9aa956a631062022051e4cbd9f6452664100fa6e77b916de0c5dca970135d7b7c03ebbec43256a928012102043005bac9a26af9d0933a407e1fba4bff958d223a7f73478888fc26e596ab01024730440220606a70a0cd4e1e5d5b236e9f9c57d150680d8d9f9e731a1b7876dfb6145e3fa502204687f9c3db4c0da88ef2f89bc665b486fefad87fae2cac8be062ae0b8e2dc775012102043005bac9a26af9d0933a407e1fba4bff958d223a7f73478888fc26e596ab0100000000",
);
export const bitcoinJSTransactionWithRBF1 = BitcoinJSTransaction.fromHex(
  "0200000000010121ca46dcd569e91efb8f89f5caf44fb8d305d6b27eda57d4e2c0cc44fd362a041000000000fffffffd014a01000000000000160014f001c49c6e329d6dec2a8922ce44000c46e083d80340917dd8ba45d226b0184501a3e04a4c74956b7a51b5ea1036cf4044c38fc1d1412c667aefa2b853439e524ff19366977eabd7272367a51a8f4a8c6f6a7d6b49ac8020ced79eadf0f9d301d4053c244d6c53d7b5ed78c89b3a0369e7a782a779361946ac0063036f7264010118746578742f706c61696e3b636861727365743d7574662d38003a7b2270223a226272632d3230222c226f70223a226d696e74222c227469636b223a2273617473222c22616d74223a22313030303030303030227d6821c0ced79eadf0f9d301d4053c244d6c53d7b5ed78c89b3a0369e7a782a77936194600000000",
);
export const bitcoinJSTransactionWithRBF2 = BitcoinJSTransaction.fromHex(
  "02000000013cb7a36060ba6c19c9e29baba400ad3a4526a30753baaca470f2dd4edc84ac8d010000006a47304402205f0859cf61910d192364fd23567ef445c65e701d7924935087b0805efa44e702022064ae500e11629fde94f11b929b9fa80d31372367a9dc8b7cb22302a5353102a4012103062b2eb9ca2d8e4245b113887c4cb6c37772c36956bd35bba964f0f6ecdcf069fdffffff020d6c0300000000001600145e589380d21a931b70a757e2aa8e0bdda694b1dd73930d00000000001976a9146e7b97bd78027bd0bae060d0409d635092e7a07488acbd260c00",
);

export const bdkTransactionWithoutRBF1 = createTransaction({
  txid: "983eca3c0ad59f1459a93fa893ec9a5610d5abdb0501656dbac803be4a564215",
  hex: "0200000000010373c72dafc650b4bb5cc58e81ed0a57e695a86dfbf9092103ecb62b2dfba5204a00000000171600142fecca63092f639cb94aa7e60d39d64eb7954c5bffffffffc2535094524c0c6bfa7ad0f4c7448bdbf468511ec78acf1ee0bc6e90c08955b1aa0000001716001405975f547907417483fda382ad60898e81af6dcdffffffff0b5934063e737b1aa10f926d009245eb92d22a0fe79e59a3428d2ce496fcaf420000000017160014c4fc25295248438adccf6b40354bed98f538a269ffffffff021d3102000000000017a914a7e14412b327e3ffee02c1f817e28fc8ff52619b8788ac11000000000017a91454f99aee545ec4a4d5d27054fb6c0763d0fff61b870247304402202001fcdc349b589f2f4ecb335d535383e68088b47d30074654067f7e3166db7b022067e6224ae87685a085226bb5e827ede445ffa2651c697ec5dcf263520e34b01b0121021d392baf5db1ac77389abce37057a7cff9c55ea78a2347c531dd169a57ebbfb102483045022100af70d99bb2980da4b9806577cbf5c9d089022de031bb2e21cb6a22ee7cb31c4a02206c57fb7be910cd2252ae12aa064f37c0403ee8695dd201b45b271e52e278162701210240adf1ac873587c6e6d5ea2fa44a95eb3a50fca97718294a152bfea0955fa26502483045022100e785a2603c9e5ea568b0a3d51b015623b32cbdb6f924d6c914fd5c74c8559ca302205879eafa4d4f22ac24ef78a18c3632266e721cdffd7f8fd237b6477ee903cef40121028896594c5f75f2c5c7621dd94042acba3e88a2da31320297cc6aa5e9d933749000000000",
  received: 1158280,
  sent: 1435965,
  fee: 134040,
});
export const bdkTransactionWithoutRBF2 = createTransaction({
  txid: "6cc040df39c32750b0ca112697a54b3f3ba35547b2be0aceb0b2b50696849a3c",
  hex: "020000000001025ba5e4f9b1b013e2f74ca7b0c1bde0fc4b7f7af95409b70693abca37fa3794ef0100000000ffffffff94f8e57bb9db2dc0d23c1a183adb713ad30bbae9a34e71eba90b2efba968b2fc0100000000ffffffff02147b1600000000002251206c09baf41ba57afd229faa252c5d8c122a9613f70c5874625c81e894ef4f28282383080000000000160014803b53fc395b14e705658b26fe23715ccc8f72b802483045022100b386867b6df2c07ee44c882dc51088ca9d9a32768cdf651e74e9aa956a631062022051e4cbd9f6452664100fa6e77b916de0c5dca970135d7b7c03ebbec43256a928012102043005bac9a26af9d0933a407e1fba4bff958d223a7f73478888fc26e596ab01024730440220606a70a0cd4e1e5d5b236e9f9c57d150680d8d9f9e731a1b7876dfb6145e3fa502204687f9c3db4c0da88ef2f89bc665b486fefad87fae2cac8be062ae0b8e2dc775012102043005bac9a26af9d0933a407e1fba4bff958d223a7f73478888fc26e596ab0100000000",
  received: 557859,
  sent: 2034039,
  fee: 2880,
});
export const bdkTransactionWithRBF1 = createTransaction({
  txid: "053f320d8b9b77c521e8d9e8e7d90692e9c51a38c3d11010069e66b37b5f53d7",
  hex: "0200000000010121ca46dcd569e91efb8f89f5caf44fb8d305d6b27eda57d4e2c0cc44fd362a041000000000fffffffd014a01000000000000160014f001c49c6e329d6dec2a8922ce44000c46e083d80340917dd8ba45d226b0184501a3e04a4c74956b7a51b5ea1036cf4044c38fc1d1412c667aefa2b853439e524ff19366977eabd7272367a51a8f4a8c6f6a7d6b49ac8020ced79eadf0f9d301d4053c244d6c53d7b5ed78c89b3a0369e7a782a779361946ac0063036f7264010118746578742f706c61696e3b636861727365743d7574662d38003a7b2270223a226272632d3230222c226f70223a226d696e74222c227469636b223a2273617473222c22616d74223a22313030303030303030227d6821c0ced79eadf0f9d301d4053c244d6c53d7b5ed78c89b3a0369e7a782a77936194600000000",
  received: 330,
  sent: 1870,
  fee: 1540,
});
export const bdkTransactionWithRBF2 = createTransaction({
  txid: "acca7d01838630a811b7c3243d20d592f0c6484ae4c9e979a733a115f8409527",
  hex: "02000000013cb7a36060ba6c19c9e29baba400ad3a4526a30753baaca470f2dd4edc84ac8d010000006a47304402205f0859cf61910d192364fd23567ef445c65e701d7924935087b0805efa44e702022064ae500e11629fde94f11b929b9fa80d31372367a9dc8b7cb22302a5353102a4012103062b2eb9ca2d8e4245b113887c4cb6c37772c36956bd35bba964f0f6ecdcf069fdffffff020d6c0300000000001600145e589380d21a931b70a757e2aa8e0bdda694b1dd73930d00000000001976a9146e7b97bd78027bd0bae060d0409d635092e7a07488acbd260c00",
  received: 889715,
  sent: 1120273,
  fee: 6289,
});

export const transactionWithoutRBF1Summary: TransactionSummary = {
  id: "983eca3c0ad59f1459a93fa893ec9a5610d5abdb0501656dbac803be4a564215",
  type: "WITHDRAWAL",
  offerData: [
    {
      offerId: "123",
      contractId: undefined,
      amount: 900,
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      currency: undefined,
      price: undefined,
    },
  ],
  amount: 277685,
  date: new Date("2022-09-14T16:14:02.835Z"),
  height: undefined,
  confirmed: false,
};

export const transactionWithRBF1Summary: TransactionSummary = {
  id: "053f320d8b9b77c521e8d9e8e7d90692e9c51a38c3d11010069e66b37b5f53d7",
  type: "WITHDRAWAL",
  offerData: [
    {
      offerId: "123",
      contractId: undefined,
      amount: 900,
      address:
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      currency: undefined,
      price: undefined,
    },
  ],
  amount: 1540,
  date: new Date("2022-09-14T16:14:02.835Z"),
  height: undefined,
  confirmed: false,
};

export const transactionWithRBF2Summary: TransactionSummary = {
  id: "acca7d01838630a811b7c3243d20d592f0c6484ae4c9e979a733a115f8409527",
  type: "WITHDRAWAL",
  offerData: [
    {
      offerId: "123",
      contractId: undefined,
      amount: 900,
      address: "bc1qtevf8qxjr2f3ku982l324rstmknffvwavecsdt",
      currency: undefined,
      price: undefined,
    },
  ],
  amount: 230558,
  date: new Date("2022-09-14T16:14:02.835Z"),
  height: undefined,
  confirmed: false,
};
