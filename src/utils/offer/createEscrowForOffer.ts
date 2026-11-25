import { peachAPI } from "../peachAPI";
import { getEscrowWallet } from "../wallet/getEscrowWallet";
import { getWallet } from "../wallet/getWallet";
import { isValidSellOfferEscrow } from "./verifySellOfferEscrow";

/**
 * @description registers the seller's escrow pubkey for an offer and verifies
 * the address the server derived from it before anything is funded.
 *
 * A Sell Offer escrow is always the single-sig taproot escrow, a pure function
 * of the seller pubkey, so it is recomputed locally. Anything else, including
 * a legacy P2WSH address, is rejected.
 */
export const createEscrowForOffer = async ({
  offerId,
  returnAddress,
}: {
  offerId: string;
  returnAddress?: string;
}) => {
  const escrowWallet = getEscrowWallet(getWallet(), offerId);

  const { result, error: err } = await peachAPI.private.offer.createEscrow({
    offerId,
    publicKey: escrowWallet.publicKey.toString("hex"),
    returnAddress,
  });

  if (err) throw new Error(err.error);
  if (!result) throw new Error("CREATE_ESCROW_ERROR");

  const escrow = result.escrows?.bitcoin ?? result.escrow;
  if (!isValidSellOfferEscrow({ id: offerId }, escrow)) {
    throw new Error("ESCROW_ADDRESS_MISMATCH");
  }

  return { ...result, escrow };
};
