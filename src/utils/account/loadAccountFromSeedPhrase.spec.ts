import { account1 } from "../../../tests/unit/data/accountData";
import { loadAccountFromSeedPhrase } from "./loadAccountFromSeedPhrase";

describe("loadAccountFromSeedPhrase", () => {
  const privateKey =
    "80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5";

  it("returns main wallet", () => {
    const wallet = loadAccountFromSeedPhrase(account1.mnemonic);

    expect(wallet.privateKey?.toString("hex")).toBe(privateKey);
  });
});
