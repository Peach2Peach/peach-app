import {
  Transaction,
  UTXO,
} from "../../../peach-api/src/@types/electrs-liquid";

export const utxo: UTXO = {
  asset: "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225",
  txid: "9de5b5e6b681dab2def654d8f70ead5cc2f31df36f715d9fd4164e12fb65e22f",
  vout: 0,
  status: {
    confirmed: true,
    block_height: 262,
    block_hash:
      "56808f623c307959c69f05cc8530a440681d05dba2d3c49dfa377c0510404ce0",
    block_time: 1646835827,
  },
  value: 200000,
};
export const mempoolUTXO: UTXO = {
  asset: "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225",
  txid: "0c5543f63f1da5e40f777bee73e70650e47d5ff520ad7eaf1d3c1abe84188e25",
  vout: 0,
  status: {
    confirmed: false,
  },
  value: 30000,
};

export const transaction: Transaction = {
  txid: "b6e8dbcae9753352dd88bf57cd30f20c73445794544d05dd5f889d83f2d25486",
  version: 2,
  locktime: 1,
  vin: [
    {
      txid: "12a51d3e6441abbdb3a5b35983260dec3ff457a301a24a4e76d41b0c0adfb99b",
      vout: 0,
      prevout: {
        scriptpubkey: "51",
        scriptpubkey_asm: "OP_PUSHNUM_1",
        scriptpubkey_type: "unknown",
        value: 2100000000000000,
        asset:
          "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225",
      },
      scriptsig: "",
      scriptsig_asm: "",
      is_coinbase: false,
      sequence: 4294967294,
      is_pegin: false,
    },
  ],
  vout: [
    {
      scriptpubkey: "001409c8ac5bea8888df17503432aab7f0fe6de415ca",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 09c8ac5bea8888df17503432aab7f0fe6de415ca",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "ert1qp8y2ckl23zyd796sxse24dlslek7g9w2fw6zwv",
      value: 100000,
      asset: "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225",
    },
    {
      scriptpubkey: "0014c6be507df17cb051f3d1f76f97d73cc698dbad3d",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 c6be507df17cb051f3d1f76f97d73cc698dbad3d",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "ert1qc6l9ql030jc9ru737ahe04euc6vdhtfapeu9wx",
      value: 2099999999899977,
      asset: "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225",
    },
    {
      scriptpubkey: "",
      scriptpubkey_asm: "",
      scriptpubkey_type: "fee",
      value: 23,
      asset: "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225",
    },
  ],
  size: 228,
  weight: 912,
  fee: 23,
  status: {
    confirmed: true,
    block_height: 2,
    block_hash:
      "0e6d69696a12e9e0b296c0fe5ca1dbcf082a249e6798d368c7fd9fb4b79cc0de",
    block_time: 1710423780,
  },
};
