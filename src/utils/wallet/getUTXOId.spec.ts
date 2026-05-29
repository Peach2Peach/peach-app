// @ts-nocheck
import { confirmed1 } from "../../../tests/unit/data/transactionDetailData";
import { getUTXOId } from "./getUTXOId";

describe("getUTXOId", () => {
  const vout = 1;
  it("returns the id of a utxo", () => {
    const utxo = {
      outpoint: { txid: { toString: () => confirmed1.txid }, vout },
      txout: { value: { toSat: () => 10000n }, scriptPubkey: {} },
      keychain: "External",
      isSpent: false,
    };
    expect(getUTXOId(utxo)).toBe(`${confirmed1.txid}:${vout}`);
  });
});
