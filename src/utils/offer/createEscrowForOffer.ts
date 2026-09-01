import { peachAPI } from "../peachAPI";
import { getEscrowWallet } from "../wallet/getEscrowWallet";
import { getWallet } from "../wallet/getWallet";
import {
  getSingleSigEscrowAddress,
  isSingleSigEscrowAddress,
} from "../wallet/singleSigEscrow";

/**
 * @description registers the seller's escrow pubkey for an offer and verifies
 * the address the server derived from it before anything is funded.
 *
 * This response carries no escrow version, so the escrow type is read off the
 * address itself: a P2TR one is the single-sig escrow, whose address is a pure
 * function of the seller pubkey and can therefore be recomputed locally. Legacy
 * P2WSH escrows also mix in a Peach key and are taken as given.
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
  if (
    isSingleSigEscrowAddress(escrow) &&
    escrow !== getSingleSigEscrowAddress(escrowWallet.publicKey)
  ) {
    throw new Error("ESCROW_ADDRESS_MISMATCH");
  }

  return { ...result, escrow };
};
