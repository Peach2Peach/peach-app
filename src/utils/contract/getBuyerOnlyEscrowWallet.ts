import { getBuyOfferWallet } from "../wallet/getBuyOfferWallet";
import { getSingleSigEscrowAddress } from "../wallet/singleSigEscrow";
import { getWallet } from "../wallet/getWallet";

/**
 * @description the Buy Offer key controlling an escrowVersion 3 escrow. Checked
 * against the contract's escrow so we never sign for an output it can't spend.
 */
export const getBuyerOnlyEscrowWallet = ({
  buyOffer69Id,
  escrow,
}: Pick<Contract, "buyOffer69Id" | "escrow">) => {
  if (buyOffer69Id === undefined) throw Error("MISSING_DATA");

  const wallet = getBuyOfferWallet(getWallet(), String(buyOffer69Id));
  if (getSingleSigEscrowAddress(wallet.publicKey) !== escrow) {
    throw Error("ESCROW_ADDRESS_MISMATCH");
  }
  return wallet;
};
