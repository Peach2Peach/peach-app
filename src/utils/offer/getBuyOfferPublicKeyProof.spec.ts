import ecc from "@bitcoinerlab/secp256k1";
import { NETWORK } from "@env";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getMainAccount } from "../account/getMainAccount";
import { getBuyOfferWallet } from "../wallet/getBuyOfferWallet";
import { getBuyOfferPublicKeyProof } from "./getBuyOfferPublicKeyProof";

const wallet = createTestWallet();
const userKey = getMainAccount(wallet, NETWORK).publicKey;
const userId = userKey.toString("hex");
const digest = (message: string) => sha256(Buffer.from(message));

describe("getBuyOfferPublicKeyProof", () => {
  const proof = getBuyOfferPublicKeyProof(wallet, userId, "123");

  it("uses a lowercase compressed key dedicated to the offer", () => {
    expect(proof.publicKey).toMatch(/^0[23][0-9a-f]{64}$/u);
    expect(proof.publicKey).not.toBe(
      getBuyOfferPublicKeyProof(wallet, userId, "124").publicKey,
    );
  });

  it("derives the same key on every attempt", () => {
    expect(getBuyOfferPublicKeyProof(wallet, userId, "123").publicKey).toBe(
      proof.publicKey,
    );
  });

  it("signs the exact message with the user key, compact encoded", () => {
    expect(proof.userSignature).toMatch(/^[0-9a-f]{128}$/u);
    expect(
      ecc.verify(
        digest(
          `I confirm that I, ${userId}, own the public key ${proof.publicKey}`,
        ),
        userKey,
        Buffer.from(proof.userSignature, "hex"),
      ),
    ).toBe(true);
  });

  it("signs the exact message with the offer key, compact encoded", () => {
    expect(proof.publicKeySignature).toMatch(/^[0-9a-f]{128}$/u);
    expect(
      ecc.verify(
        digest(
          `I confirm that the public key ${proof.publicKey} belongs to the user ${userId}`,
        ),
        getBuyOfferWallet(wallet, "123").publicKey,
        Buffer.from(proof.publicKeySignature, "hex"),
      ),
    ).toBe(true);
  });
});
