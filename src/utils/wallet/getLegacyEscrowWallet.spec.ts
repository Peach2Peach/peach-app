import { deepStrictEqual, strictEqual } from "assert";
import { getLegacyEscrowWallet } from "./getLegacyEscrowWallet";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getNetwork } from "./getNetwork";

describe("getLegacyEscrowWallet", () => {
  it("returns wallet for escrow depending on offer id", () => {
    const network = getNetwork();
    const expectedPrivateKey =
      "a441c169d244e92d6e254a6ed2877372dd679aebd0b4177ed349ba5efeaf75a4";
    const expectedPublicKey =
      "03f54c36a63e6432f8744f4afc14ecf99d8882898d687878a1f972d89d01168e6c";
    const recoveredWallet = createTestWallet();

    const escrowWallet = getLegacyEscrowWallet(recoveredWallet, "1");

    deepStrictEqual(escrowWallet.network, network, "Network is not correct");
    strictEqual(escrowWallet.privateKey?.toString("hex"), expectedPrivateKey);
    strictEqual(escrowWallet.publicKey.toString("hex"), expectedPublicKey);
  });
});
