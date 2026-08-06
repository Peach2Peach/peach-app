import { getRandom } from "../../crypto/getRandom";
import { peachAPI } from "../../peachAPI";
import { getEscrowWalletForOffer } from "../getEscrowWalletForOffer";
import { musig } from "../../musig/musig";
import { deriveTaprootEscrow } from "./deriveTaprootEscrow";
import { verifyReleaseTransaction } from "./verifyReleaseTransaction";

const SESSION_ID_BYTES = 32;

/**
 * @description releases a MuSig2 taproot (escrow version 2) escrow.
 *
 * Round 1: Peach builds the release transaction and publishes its public
 * nonce, round 2: we publish ours together with our partial signature and
 * Peach aggregates both into the final key path signature and broadcasts.
 *
 * A secret nonce is single use - signing two different messages with the same
 * one leaks the escrow private key. `musig.partialSign` drops it after use, so
 * a failed attempt must always restart at `/release/start`
 */
export async function releaseTaprootEscrow({
  sellOffer,
  releaseAddress,
}: {
  sellOffer: SellOffer;
  /** the buyer's payout address, from the contract */
  releaseAddress: string;
}) {
  const wallet = getEscrowWalletForOffer(sellOffer);
  if (!wallet.privateKey) throw Error("MISSING_ESCROW_PRIVATE_KEY");

  const { result: startResult, error: startError } =
    await peachAPI.private.offer.startTaprootEscrowRelease({
      offerId: sellOffer.id,
    });
  if (!startResult) throw Error(startError?.error || "TAPROOT_RELEASE_FAILED");

  const {
    sessionId,
    unsignedTx,
    sighash: sighashHex,
    peachPubNonce: peachPubNonceHex,
    peachPublicKey,
    expiry,
    escrowAddress,
  } = startResult;

  const escrow = deriveTaprootEscrow({
    sellerPublicKey: wallet.publicKey,
    peachPublicKey: Buffer.from(peachPublicKey, "hex"),
    expiry,
  });
  if (escrow.address !== escrowAddress) throw Error("ESCROW_ADDRESS_MISMATCH");

  const sighash = Buffer.from(sighashHex, "hex");
  verifyReleaseTransaction({
    unsignedTx,
    sighash,
    escrow,
    releaseAddress,
    funding: sellOffer.funding,
  });

  const sellerPubNonce = musig.nonceGen({
    sessionId: await getRandom(SESSION_ID_BYTES),
    secretKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    xOnlyPublicKey: escrow.outputKey,
    msg: sighash,
  });

  // the aggregation order is part of the wire contract, Peach's nonce first
  const aggNonce = musig.nonceAgg([
    Buffer.from(peachPubNonceHex, "hex"),
    sellerPubNonce,
  ]);
  const sessionKey = musig.startSigningSession(
    aggNonce,
    sighash,
    escrow.publicKeys,
    { tweak: escrow.tweak, xOnly: true },
  );
  const sellerPartialSig = musig.partialSign({
    secretKey: wallet.privateKey,
    publicNonce: sellerPubNonce,
    sessionKey,
    verify: true,
  });

  const { result, error } =
    await peachAPI.private.offer.completeTaprootEscrowRelease({
      offerId: sellOffer.id,
      sessionId,
      sellerPubNonce: Buffer.from(sellerPubNonce).toString("hex"),
      sellerPartialSig: Buffer.from(sellerPartialSig).toString("hex"),
    });
  if (!result) throw Error(error?.error || "TAPROOT_RELEASE_FAILED");

  return result;
}
