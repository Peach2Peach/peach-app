import { getRandom } from "../crypto/getRandom";
import { getLiquidEscrowAddress } from "./getLiquidEscrowAddress";
import { getLiquidEscrowTweak } from "./getLiquidEscrowTweak";
import { musig } from "./musig";

const SESSION_ID_BYTES = 32;

type Props = {
  /** the seller's escrow key pair */
  sellerPrivateKey: Uint8Array;
  sellerPublicKey: Uint8Array;
  /** Peach's escrow pubkey, 33-byte compressed */
  peachPublicKey: Uint8Array;
  /** Peach's public nonce for this attempt, 66 bytes */
  peachPubNonce: Uint8Array;
  /** the 32-byte message to sign, from /release/start */
  sighash: Uint8Array;
  /** relative timelock of the escrow's script path, in blocks */
  expiry: number;
  /** the funded escrow address; signing is refused if the local derivation
   * does not reproduce it */
  escrowAddress: string;
};

/**
 * Round 2 of the MuSig2 release, wallet side.
 *
 * The secret nonce never leaves musig-js: `nonceGen` keeps it internally and
 * `partialSign` looks it up by public nonce. Nothing here is persisted, so a
 * failed release simply starts over from `/release/start` with a fresh nonce —
 * which is required, since signing two different messages with the same secret
 * nonce leaks the private key.
 */
export async function signLiquidEscrowRelease({
  sellerPrivateKey,
  sellerPublicKey,
  peachPublicKey,
  peachPubNonce,
  sighash,
  expiry,
  escrowAddress,
}: Props) {
  // BIP327 key aggregation is order-sensitive; both sides KeySort first
  const publicKeys = musig.keySort([sellerPublicKey, peachPublicKey]);

  const aggregateXOnlyPublicKey = musig.getXOnlyPubkey(
    musig.keyAgg(publicKeys),
  );
  const tweak = {
    tweak: getLiquidEscrowTweak({
      aggregateXOnlyPublicKey,
      peachXOnlyPublicKey: peachPublicKey.slice(1),
      expiry,
    }),
    xOnly: true,
  };
  // the taproot output key the escrow was funded to
  const outputKey = musig.getXOnlyPubkey(musig.keyAgg(publicKeys, tweak));

  // If the local derivation does not reproduce the funded address, either the
  // tweak is wrong or the data is — signing a sighash we cannot tie back to
  // our own escrow would be authorising an unknown transaction.
  if (getLiquidEscrowAddress(outputKey) !== escrowAddress) {
    throw new Error("ESCROW_ADDRESS_MISMATCH");
  }

  const sellerPubNonce = musig.nonceGen({
    sessionId: Uint8Array.from(await getRandom(SESSION_ID_BYTES)),
    secretKey: sellerPrivateKey,
    publicKey: sellerPublicKey,
    xOnlyPublicKey: outputKey,
    msg: sighash,
  });

  // nonce ordering is part of the wire contract with the server
  const aggNonce = musig.nonceAgg([peachPubNonce, sellerPubNonce]);

  const sessionKey = musig.startSigningSession(
    aggNonce,
    sighash,
    publicKeys,
    tweak,
  );

  const sellerPartialSig = musig.partialSign({
    secretKey: sellerPrivateKey,
    publicNonce: sellerPubNonce,
    sessionKey,
    verify: true,
  });

  return {
    sellerPubNonce: Buffer.from(sellerPubNonce).toString("hex"),
    sellerPartialSig: Buffer.from(sellerPartialSig).toString("hex"),
  };
}
