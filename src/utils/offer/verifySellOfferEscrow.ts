import { getEscrowWallet } from "../wallet/getEscrowWallet";
import { getWallet } from "../wallet/getWallet";
import {
  getSingleSigEscrowAddress,
  isSingleSigEscrowAddress,
} from "../wallet/singleSigEscrow";

type SellOfferKeyInfo = {
  id: string;
  /** a republished offer keeps the escrow, and with it the key, of the original */
  oldOfferId?: string;
  derivationPathVersion?: number;
};

/**
 * @description the escrow of a Sell Offer (not of a Contract, those come from
 * Buy Offers) is always the single-sig taproot escrow: a BIP86 key-path-only
 * P2TR of the escrow key derived at the offer index. Legacy P2WSH escrows are
 * not supported anymore. Recompute it locally rather than trusting the server.
 */
export const getExpectedSellOfferEscrowAddress = ({
  id,
  oldOfferId,
  derivationPathVersion,
}: SellOfferKeyInfo) =>
  getSingleSigEscrowAddress(
    getEscrowWallet(getWallet(), oldOfferId || id, derivationPathVersion)
      .publicKey,
  );

/** never throws: false whenever the address cannot be confirmed as ours */
export const isValidSellOfferEscrow = (
  offer: SellOfferKeyInfo,
  address: string | undefined,
) => {
  if (!address || !isSingleSigEscrowAddress(address)) return false;
  try {
    return address === getExpectedSellOfferEscrowAddress(offer);
  } catch (e) {
    return false;
  }
};
