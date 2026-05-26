// @ts-nocheck
import { getUTXOAddress } from "./getUTXOAddress";

jest.mock("bdk-rn", () => ({
  Address: { fromScript: () => ({ toString: () => "address" }) },
  Network: { Regtest: 3, Bitcoin: 1, Testnet: 2, Signet: 4 },
}));

describe("getUTXOAddress", () => {
  const utxo = {
    outpoint: { txid: { toString: () => "tx" }, vout: 1 },
    txout: { value: { toSat: () => 10000n }, scriptPubkey: {} },
    keychain: "External",
    isSpent: false,
  };

  it("returns the address of a UTXO", () => {
    expect(getUTXOAddress(3)(utxo)).toBe("address");
  });
});
