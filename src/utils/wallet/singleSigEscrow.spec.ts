import ecc from "@bitcoinerlab/secp256k1";
import { initEccLib, payments } from "bitcoinjs-lib";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getEscrowWallet } from "./getEscrowWallet";
import { getNetwork } from "./getNetwork";
import {
  getSingleSigEscrowAddress,
  getSingleSigEscrowScript,
  getTweakedEscrowSigner,
  isSingleSigEscrowAddress,
  toXOnly,
} from "./singleSigEscrow";

initEccLib(ecc);

const X_ONLY_KEY_START = 1;
const X_ONLY_KEY_END = 33;
const OUTPUT_KEY_START = 2;
const OUTPUT_KEY_END = 34;

describe("singleSigEscrow", () => {
  const escrowWallet = getEscrowWallet(createTestWallet(), "1");

  it("derives a key path only P2TR address from the seller pubkey alone", () => {
    const address = getSingleSigEscrowAddress(escrowWallet.publicKey);

    expect(address).toStrictEqual(
      payments.p2tr({
        internalPubkey: escrowWallet.publicKey.subarray(
          X_ONLY_KEY_START,
          X_ONLY_KEY_END,
        ),
        network: getNetwork(),
      }).address,
    );
    expect(address.startsWith("bcrt1p")).toBe(true);
  });

  // offer "1" derives an even parity escrow key, offer "2" an odd one - the
  // tweak has to negate the private key for the latter
  it.each(["1", "2"])(
    "tweaks the escrow key of offer %s onto the output key of the escrow",
    (offerId) => {
      const wallet = getEscrowWallet(createTestWallet(), offerId);
      const tweaked = getTweakedEscrowSigner(wallet);
      const outputKey = getSingleSigEscrowScript(wallet.publicKey).subarray(
        OUTPUT_KEY_START,
        OUTPUT_KEY_END,
      );

      expect(toXOnly(tweaked.publicKey)).toStrictEqual(outputKey);
    },
  );

  it("returns real Buffers, since bitcoinjs rejects plain Uint8Arrays", () => {
    expect(Buffer.isBuffer(toXOnly(escrowWallet.publicKey))).toBe(true);
    expect(
      Buffer.isBuffer(getSingleSigEscrowScript(escrowWallet.publicKey)),
    ).toBe(true);
  });

  it("recognises P2TR escrow addresses and rejects legacy ones", () => {
    expect(
      isSingleSigEscrowAddress(getSingleSigEscrowAddress(escrowWallet.publicKey)),
    ).toBe(true);
    // P2WSH - a legacy escrow address
    expect(
      isSingleSigEscrowAddress(
        "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      ),
    ).toBe(false);
    expect(isSingleSigEscrowAddress("not an address")).toBe(false);
  });
});
