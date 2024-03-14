import { transaction } from "../../../../tests/unit/data/liquidBlockExplorerData";
import { liquidAddresses } from "../../../../tests/unit/data/liquidNetworkData";
import { toUTXO } from "./toUTXO";

describe("toUTXO", () => {
  it("should turn a transactions to a UTXO", () => {
    expect(
      toUTXO([transaction], "ert1qp8y2ckl23zyd796sxse24dlslek7g9w2fw6zwv"),
    ).toEqual([
      {
        asset:
          "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225",
        status: {
          block_hash:
            "0e6d69696a12e9e0b296c0fe5ca1dbcf082a249e6798d368c7fd9fb4b79cc0de",
          block_height: 2,
          block_time: 1710423780,
          confirmed: true,
        },
        txid: "b6e8dbcae9753352dd88bf57cd30f20c73445794544d05dd5f889d83f2d25486",
        value: 100000,
        vout: 0,
      },
    ]);
  });
  it("should not return UTXO for tx where address is not an output of the tx", () => {
    expect(toUTXO([transaction], liquidAddresses.regtest[0])).toEqual([]);
  });
});
