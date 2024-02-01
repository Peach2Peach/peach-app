import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { getOffer } from "../offer/getOffer";
import { isSellOffer } from "../offer/isSellOffer";
import { isDefined } from "../validation/isDefined";
import { getTxDefaultLabel } from "./getTxDefaultLabel";
import { useWalletState } from "./walletStore";

export const labelAddressByTransaction = (tx: TransactionDetails): void => {
  const offerIds = useWalletState.getState().txOfferMap[tx.txid];
  const offers = offerIds.map(getOffer).filter(isDefined);

  offers.forEach((offer) => {
    const label = getTxDefaultLabel(tx);
    if (!label) return;

    const address = isSellOffer(offer)
      ? offer.returnAddress
      : offer.releaseAddress;

    useWalletState.getState().labelAddress(address, label);
  });
};
