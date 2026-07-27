import * as ecc from "@bitcoinerlab/secp256k1";
import { getLiquidEscrowAddress } from "./getLiquidEscrowAddress";
import { getLiquidEscrowTweak } from "./getLiquidEscrowTweak";
import { musig } from "./musig";
import { signLiquidEscrowRelease } from "./signLiquidEscrowRelease";

const SELLER_KEY = Uint8Array.from(Buffer.from("11".repeat(32), "hex"));
const PEACH_KEY = Uint8Array.from(Buffer.from("22".repeat(32), "hex"));
const SIGHASH = Uint8Array.from(Buffer.from("33".repeat(32), "hex"));
const EXPIRY = 43200;

const sellerPublicKey = ecc.pointFromScalar(SELLER_KEY, true) as Uint8Array;
const peachPublicKey = ecc.pointFromScalar(PEACH_KEY, true) as Uint8Array;

/** what the server does with its half of the session */
function peachSide() {
  const publicKeys = musig.keySort([sellerPublicKey, peachPublicKey]);
  const tweak = {
    tweak: getLiquidEscrowTweak({
      aggregateXOnlyPublicKey: musig.getXOnlyPubkey(musig.keyAgg(publicKeys)),
      peachXOnlyPublicKey: peachPublicKey.slice(1),
      expiry: EXPIRY,
    }),
    xOnly: true,
  };
  const outputKey = musig.getXOnlyPubkey(musig.keyAgg(publicKeys, tweak));
  const peachPubNonce = musig.nonceGen({
    sessionId: Uint8Array.from(Buffer.from("44".repeat(32), "hex")),
    secretKey: PEACH_KEY,
    publicKey: peachPublicKey,
    xOnlyPublicKey: outputKey,
    msg: SIGHASH,
  });
  return {
    publicKeys,
    tweak,
    outputKey,
    peachPubNonce,
    escrowAddress: getLiquidEscrowAddress(outputKey),
  };
}

describe("signLiquidEscrowRelease", () => {
  it("produces a partial signature the counterparty can verify and aggregate", async () => {
    const { publicKeys, tweak, outputKey, peachPubNonce, escrowAddress } =
      peachSide();

    const { sellerPubNonce, sellerPartialSig } = await signLiquidEscrowRelease({
      sellerPrivateKey: SELLER_KEY,
      sellerPublicKey,
      peachPublicKey,
      peachPubNonce,
      sighash: SIGHASH,
      expiry: EXPIRY,
      escrowAddress,
    });

    const sellerNonceBytes = Uint8Array.from(
      Buffer.from(sellerPubNonce, "hex"),
    );
    // the nonce ordering is part of the wire contract
    const aggNonce = musig.nonceAgg([peachPubNonce, sellerNonceBytes]);
    const sessionKey = musig.startSigningSession(
      aggNonce,
      SIGHASH,
      publicKeys,
      tweak,
    );

    expect(
      musig.partialVerify({
        sig: Uint8Array.from(Buffer.from(sellerPartialSig, "hex")),
        publicKey: sellerPublicKey,
        publicNonce: sellerNonceBytes,
        sessionKey,
      }),
    ).toBeTruthy();

    const peachPartialSig = musig.partialSign({
      secretKey: PEACH_KEY,
      publicNonce: peachPubNonce,
      sessionKey,
    });
    const finalSig = musig.signAgg(
      [
        peachPartialSig,
        Uint8Array.from(Buffer.from(sellerPartialSig, "hex")),
      ],
      sessionKey,
    );

    // the aggregate signature must verify against the taproot output key the
    // escrow was funded to, not the untweaked aggregate key
    expect(ecc.verifySchnorr(SIGHASH, outputKey, finalSig)).toBeTruthy();
  });

  it("never reuses a nonce across attempts", async () => {
    const { peachPubNonce, escrowAddress } = peachSide();
    const args = {
      sellerPrivateKey: SELLER_KEY,
      sellerPublicKey,
      peachPublicKey,
      peachPubNonce,
      sighash: SIGHASH,
      expiry: EXPIRY,
      escrowAddress,
    };

    const first = await signLiquidEscrowRelease(args);
    const second = await signLiquidEscrowRelease(args);

    expect(first.sellerPubNonce).not.toBe(second.sellerPubNonce);
  });

  it("refuses to sign when the derivation does not reproduce the escrow", async () => {
    const { peachPubNonce } = peachSide();

    await expect(
      signLiquidEscrowRelease({
        sellerPrivateKey: SELLER_KEY,
        sellerPublicKey,
        peachPublicKey,
        peachPubNonce,
        sighash: SIGHASH,
        // a wrong timelock changes the tapleaf, hence the tweak, hence the
        // address — exactly the class of mistake this guard exists for
        expiry: EXPIRY + 1,
        escrowAddress: peachSide().escrowAddress,
      }),
    ).rejects.toThrow("ESCROW_ADDRESS_MISMATCH");
  });
});

describe("getLiquidEscrowTweak", () => {
  it("uses the elements tagged hashes, so the tweak matches the funded output", () => {
    const publicKeys = musig.keySort([sellerPublicKey, peachPublicKey]);
    const aggregateXOnlyPublicKey = musig.getXOnlyPubkey(
      musig.keyAgg(publicKeys),
    );
    const tweak = getLiquidEscrowTweak({
      aggregateXOnlyPublicKey,
      peachXOnlyPublicKey: peachPublicKey.slice(1),
      expiry: EXPIRY,
    });

    const viaMusig = musig.getXOnlyPubkey(
      musig.keyAgg(publicKeys, { tweak, xOnly: true }),
    );
    const viaEcc = ecc.xOnlyPointAddTweak(aggregateXOnlyPublicKey, tweak);

    expect(Buffer.from(viaEcc?.xOnlyPubkey ?? []).toString("hex")).toBe(
      Buffer.from(viaMusig).toString("hex"),
    );
  });
});
