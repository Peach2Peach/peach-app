import ecc from "@bitcoinerlab/secp256k1";
import { initEccLib, networks, payments } from "bitcoinjs-lib";
import { musig } from "../../musig/musig";
import { deriveTaprootEscrow, toXOnly } from "./deriveTaprootEscrow";

initEccLib(ecc);

const sellerSecretKey = Buffer.from(
  "be01d8dcf3879a0fec05130ca95d35bf7823833e3cdf91e310408606717055d9",
  "hex",
);
const peachSecretKey = Buffer.from(
  "644b07a5cb70f68316cd9a51cabdc61c4d0b1f38b189d0c92370a3844fd0241f",
  "hex",
);
const sellerPublicKey = Buffer.from(
  ecc.pointFromScalar(sellerSecretKey, true)!,
);
const peachPublicKey = Buffer.from(ecc.pointFromScalar(peachSecretKey, true)!);
const expiry = 4320;

describe("deriveTaprootEscrow", () => {
  it("derives the same escrow no matter the order of the public keys", () => {
    const escrow = deriveTaprootEscrow({
      sellerPublicKey,
      peachPublicKey,
      expiry,
    });
    const reversed = deriveTaprootEscrow({
      sellerPublicKey: peachPublicKey,
      peachPublicKey: sellerPublicKey,
      expiry,
    });

    expect(escrow.internalKey).toEqual(reversed.internalKey);
    expect(escrow.publicKeys).toEqual(reversed.publicKeys);
  });

  it("derives a p2tr address for the given network", () => {
    const escrow = deriveTaprootEscrow({
      sellerPublicKey,
      peachPublicKey,
      expiry,
    });
    expect(escrow.address.startsWith("bcrt1p")).toBe(true);

    const mainnet = deriveTaprootEscrow({
      sellerPublicKey,
      peachPublicKey,
      expiry,
      network: networks.bitcoin,
    });
    expect(mainnet.address.startsWith("bc1p")).toBe(true);
    expect(mainnet.outputKey).toEqual(escrow.outputKey);
  });

  it("derives the same output key as bitcoinjs' p2tr script path tweaking", () => {
    const escrow = deriveTaprootEscrow({
      sellerPublicKey,
      peachPublicKey,
      expiry,
    });

    const p2tr = payments.p2tr({
      internalPubkey: escrow.internalKey,
      scriptTree: { output: escrow.leafScript },
      network: networks.regtest,
    });

    expect(p2tr.address).toBe(escrow.address);
    expect(p2tr.output).toEqual(escrow.script);
  });

  it("puts the expiry and Peach's x-only key into the refund leaf", () => {
    const { leafScript } = deriveTaprootEscrow({
      sellerPublicKey,
      peachPublicKey,
      expiry,
    });

    // <expiry> OP_CHECKSEQUENCEVERIFY OP_DROP <peachXOnly> OP_CHECKSIG
    expect(leafScript.toString("hex")).toBe(
      `02e010b27520${toXOnly(peachPublicKey).toString("hex")}ac`,
    );
  });

  it("produces a valid key path signature from both partial signatures", () => {
    const escrow = deriveTaprootEscrow({
      sellerPublicKey,
      peachPublicKey,
      expiry,
    });
    const sighash = Buffer.from(
      "f1d1d6ef2d97319149aaed92c69ebb21d6c54c0fc4e908f4f4ee42a1e5b8b854",
      "hex",
    );

    const peachPubNonce = musig.nonceGen({
      sessionId: Buffer.alloc(32, 1),
      secretKey: peachSecretKey,
      publicKey: peachPublicKey,
      xOnlyPublicKey: escrow.outputKey,
      msg: sighash,
    });
    const sellerPubNonce = musig.nonceGen({
      sessionId: Buffer.alloc(32, 2),
      secretKey: sellerSecretKey,
      publicKey: sellerPublicKey,
      xOnlyPublicKey: escrow.outputKey,
      msg: sighash,
    });

    const aggNonce = musig.nonceAgg([peachPubNonce, sellerPubNonce]);
    const session = musig.startSigningSession(
      aggNonce,
      sighash,
      escrow.publicKeys,
      { tweak: escrow.tweak, xOnly: true },
    );

    const sellerPartialSig = musig.partialSign({
      secretKey: sellerSecretKey,
      publicNonce: sellerPubNonce,
      sessionKey: session,
      verify: true,
    });
    const peachPartialSig = musig.partialSign({
      secretKey: peachSecretKey,
      publicNonce: peachPubNonce,
      sessionKey: session,
      verify: true,
    });

    expect(sellerPartialSig).toHaveLength(32);
    expect(
      musig.partialVerify({
        sig: sellerPartialSig,
        publicKey: sellerPublicKey,
        publicNonce: sellerPubNonce,
        sessionKey: session,
      }),
    ).toBe(true);

    const signature = musig.signAgg(
      [sellerPartialSig, peachPartialSig],
      session,
    );

    expect(signature).toHaveLength(64);
    expect(ecc.verifySchnorr(sighash, escrow.outputKey, signature)).toBe(true);
  });
});
