import { account1 } from "../../../tests/unit/data/accountData";
import { getError } from "../../../tests/unit/helpers/getError";
import { loadWalletFromAccount } from "./loadWalletFromAccount";

describe("loadWalletFromAccount", () => {
  const privateKey =
    "80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5";
  it("loads wallet from base58", () => {
    const wallet = loadWalletFromAccount(account1);
    expect(wallet.privateKey.toString("hex")).toBe(privateKey);
  });
  it("loads wallet from seed phrase", () => {
    const wallet = loadWalletFromAccount({ ...account1, base58: undefined });
    expect(wallet.privateKey.toString("hex")).toBe(privateKey);
  });
  it("throws error if mnemonic and base58 are not defined", async () => {
    const error = await getError<Error>(() =>
      loadWalletFromAccount({
        ...account1,
        mnemonic: undefined,
        base58: undefined,
      }),
    );
    expect(error.message).toBe("MISSING_SEED");
  });
});
