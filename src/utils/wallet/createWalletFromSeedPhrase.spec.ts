import { deepStrictEqual, strictEqual } from "assert";
import { account1 } from "../../../tests/unit/data/accountData";
import { createWalletFromSeedPhrase } from "./createWalletFromSeedPhrase";
import { getNetwork } from "./getNetwork";

describe("createWalletFromSeedPhrase", () => {
  it("recovers a wallet from mnemonic", () => {
    const network = getNetwork();
    const expectedPrivateKey =
      "80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5";
    const expectedPublicKey =
      "02383ee5e64037a1164ccd93e0b4787e461047b4b1eea51ec2fee9d394d241abc2";
    const recoveredWallet = createWalletFromSeedPhrase(
      account1.mnemonic,
      network,
    );

    deepStrictEqual(
      recoveredWallet.wallet.network,
      network,
      "Network is not correct",
    );
    strictEqual(
      recoveredWallet.wallet.privateKey.toString("hex"),
      expectedPrivateKey,
    );
    strictEqual(
      recoveredWallet.wallet.publicKey.toString("hex"),
      expectedPublicKey,
    );
  });
});
