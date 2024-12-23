import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getEscrowWallet } from "./getEscrowWallet";
import { getNetwork } from "./getNetwork";

describe("getEscrowWallet", () => {
  it("returns wallet for escrow depending on offer id", () => {
    const network = getNetwork();
    const expectedPrivateKey =
      "c37f0972d69742fb0265037c1d0771d530582973faf54a81c382bb47e2a2a46f";
    const expectedPublicKey =
      "025f088c65f92954f00b9e54cd73f4bc32a9cdbdd8cb99649a6dad39fdcd87c175";
    const recoveredWallet = createTestWallet();

    const escrowWallet = getEscrowWallet(recoveredWallet, "1");

    expect(escrowWallet.network).toStrictEqual(network);
    expect(escrowWallet.privateKey?.toString("hex")).toStrictEqual(
      expectedPrivateKey,
    );
    expect(escrowWallet.publicKey.toString("hex")).toStrictEqual(
      expectedPublicKey,
    );
  });
});
