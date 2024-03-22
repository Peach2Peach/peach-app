import { createRandomWallet } from "../wallet/createRandomWallet";
import { getNetwork } from "../wallet/getNetwork";
import { createAccount } from "./createAccount";

describe("createAccount", () => {
  it("creates a new account", async () => {
    const { mnemonic, wallet } = await createRandomWallet(getNetwork());
    const newAccount = await createAccount({ wallet, mnemonic });

    expect(newAccount.publicKey.length).toBeGreaterThan(0);
    expect(newAccount.mnemonic?.length).toBeGreaterThan(0);
    expect(newAccount.base58?.length).toBeGreaterThan(0);
  });
});
