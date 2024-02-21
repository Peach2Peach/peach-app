import { account1 } from "../../../tests/unit/data/accountData";
import { createWalletFromBase58 } from "./createWalletFromBase58";
import { getNetwork } from "./getNetwork";

describe("createWalletFromBase58", () => {
  it("recovers a wallet from mnemonic", () => {
    const network = getNetwork();
    const expectedPrivateKey =
      "80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5";
    const expectedPublicKey =
      "02383ee5e64037a1164ccd93e0b4787e461047b4b1eea51ec2fee9d394d241abc2";
    const recoveredWallet = createWalletFromBase58(account1.base58, network);

    expect(recoveredWallet.network).toStrictEqual(network);
    expect(recoveredWallet.privateKey?.toString("hex")).toStrictEqual(
      expectedPrivateKey,
    );
    expect(recoveredWallet.publicKey.toString("hex")).toStrictEqual(
      expectedPublicKey,
    );
  });
});
