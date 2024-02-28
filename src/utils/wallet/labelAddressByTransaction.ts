import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { getOffer } from "../offer/getOffer";
import { isSellOffer } from "../offer/isSellOffer";
import { isNotNull } from "../validation/isNotNull";
import { getTxDefaultLabel } from "./getTxDefaultLabel";
import { useWalletState } from "./walletStore";

export async function labelAddressByTransaction(tx: TransactionDetails) {
  const offerIds = useWalletState.getState().txOfferMap[tx.txid] || [];
  const offers = (await Promise.all(offerIds.map(getOffer))).filter(isNotNull);

  offers.forEach((offer) => {
    const label = getTxDefaultLabel(tx);
    if (!label) return;

    const address = isSellOffer(offer)
      ? offer.returnAddress
      : offer.releaseAddress;

    useWalletState.getState().labelAddress(address, label);
  });
}
