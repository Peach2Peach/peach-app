import { getEscrowWallet } from "./getEscrowWallet";
import { getLegacyEscrowWallet } from "./getLegacyEscrowWallet";
import { getWallet } from "./getWallet";

/**
 * @deprecated
 */
export const getEscrowWalletForOffer = (offer: SellOffer) => {
  const index = offer.oldOfferId || offer.id;
  const escrowWallet = getEscrowWallet(
    getWallet(),
    index,
    offer.derivationPathVersion,
  );

  if (escrowWallet.publicKey.toString("hex") === offer.publicKey)
    return escrowWallet;

  if (offer.derivationPathVersion) {
    throw Error("didnt find correct private key for offer");
  }

  return getLegacyEscrowWallet(getWallet(), index);
};
