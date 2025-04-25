import { getEscrowWallet } from "./getEscrowWallet";
import { getLegacyEscrowWallet } from "./getLegacyEscrowWallet";
import { getWallet } from "./getWallet";

/**
 * @deprecated
 */
export const getEscrowWalletForOffer = (offer: SellOffer) => {
  const index = offer.oldOfferId || offer.id;
  const escrowWallet = getEscrowWallet(getWallet(), index);

  if (escrowWallet.publicKey.toString("hex") === offer.publicKey)
    return escrowWallet;

  return getLegacyEscrowWallet(getWallet(), index);
};
