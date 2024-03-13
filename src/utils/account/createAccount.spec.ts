import { createAccount } from "./createAccount";

describe("createAccount", () => {
  it("creates a new account", async () => {
    const newAccount = await createAccount();

    expect(newAccount.publicKey.length).toBeGreaterThan(0);
    expect(newAccount.mnemonic?.length).toBeGreaterThan(0);
    expect(newAccount.base58?.length).toBeGreaterThan(0);
  });
  it("creates a new account each time", async () => {
    const newAccount1 = await createAccount();
    const newAccount2 = await createAccount();

    expect(newAccount1.publicKey).not.toBe(newAccount2.publicKey);
    expect(newAccount1.mnemonic).not.toBe(newAccount2.mnemonic);
    expect(newAccount1.base58).not.toBe(newAccount2.base58);
  });
});
