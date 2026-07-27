import { getSellOfferFromContract } from "../../../utils/contract/getSellOfferFromContract";
import { signLiquidEscrowRelease } from "../../../utils/liquid/signLiquidEscrowRelease";
import { peachAPI } from "../../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../../utils/wallet/getEscrowWalletForOffer";

const fromHex = (hex: string) => Uint8Array.from(Buffer.from(hex, "hex"));

/**
 * Releases a liquid MuSig2 escrow.
 *
 * Neither party can sign alone, so this is a live 2-round exchange rather than
 * "sign a PSBT and post it": `/release/start` hands back the sighash, Peach's
 * public nonce and everything needed to rebuild the taproot tweak; the wallet
 * produces a partial signature; `/release/complete` has Peach add its own and
 * broadcast.
 *
 * The session is single-use with a 5 minute TTL, so there is deliberately no
 * retry of `/complete` here — any failure has to restart from `/start` with a
 * fresh nonce, which is what re-running this whole function does.
 */
export async function confirmPaymentSellerLiquid(contract: Contract) {
  const sellOffer = await getSellOfferFromContract(contract);
  if (!sellOffer) throw new Error("SELL_OFFER_NOT_FOUND");

  const wallet = getEscrowWalletForOffer(sellOffer);
  if (!wallet.privateKey) throw new Error("ESCROW_KEY_NOT_FOUND");

  const offerId = sellOffer.id;

  const { result: session, error: startError } =
    await peachAPI.private.offer.startLiquidEscrowRelease({ offerId });
  if (!session || startError) {
    throw new Error(startError?.error || "RELEASE_START_FAILED");
  }

  const { sellerPubNonce, sellerPartialSig } = await signLiquidEscrowRelease({
    sellerPrivateKey: Uint8Array.from(wallet.privateKey),
    sellerPublicKey: Uint8Array.from(wallet.publicKey),
    peachPublicKey: fromHex(session.peachPublicKey),
    peachPubNonce: fromHex(session.peachPubNonce),
    sighash: fromHex(session.sighash),
    expiry: session.expiry,
    escrowAddress: session.escrowAddress,
  });

  const { error: completeError } =
    await peachAPI.private.offer.completeLiquidEscrowRelease({
      offerId,
      sessionId: session.sessionId,
      sellerPubNonce,
      sellerPartialSig,
    });
  if (completeError) throw new Error(completeError.error);
}
