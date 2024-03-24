import { Transaction as BitcoinTransaction } from "bitcoinjs-lib";
import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { bitcoinTransactionHex } from "../../../../tests/unit/data/bitcoinNetworkData";
import { liquidTransactionHex } from "../../../../tests/unit/data/liquidNetworkData";
import { getAddressesFromOutputs } from "./getAddressesFromOutputs";

describe("getAddressesFromOutputs", () => {
  it("should return addresses from transaction outputs", () => {
    expect(
      getAddressesFromOutputs({
        outs: BitcoinTransaction.fromHex(bitcoinTransactionHex).outs,
        chain: "bitcoin",
      }),
    ).toEqual([
      "bcrt1qjpq8uus03kr9kch2er3vvt34t9fxfrqze9m5e5",
      "bcrt1qrfxr69jqnhwufxgkqgcdep9prq4j4vuwzpxkrk",
    ]);
  });
  it("should return addresses from liquid transaction outputs", () => {
    expect(
      getAddressesFromOutputs({
        outs: LiquidTransaction.fromHex(liquidTransactionHex).outs,
        chain: "liquid",
      }),
    ).toEqual(["ert1q6e27c38p9cq07pjcdp9n7vfrd60k2wj3vmqv4h"]);
  });
});
