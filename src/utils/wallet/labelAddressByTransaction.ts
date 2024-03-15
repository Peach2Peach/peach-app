import { contractIdToHex } from "../contract/contractIdToHex";
import { getOffer } from "../offer/getOffer";
import { isSellOffer } from "../offer/isSellOffer";
import { offerIdToHex } from "../offer/offerIdToHex";
import { isDefined } from "../validation/isDefined";
import { isNotNull } from "../validation/isNotNull";
import { useWalletState } from "./walletStore";

export async function labelAddressByTransaction(txId: string) {
  const offerIds = useWalletState.getState().txOfferMap[txId] || [];
  const offers = (await Promise.all(offerIds.map(getOffer))).filter(isNotNull);
  offers.forEach((offer) => {
    const label = offers
      .map((offerSummary) => {
        const contractId = offerSummary?.contractId;
        if (contractId) return contractIdToHex(contractId);
        if (offerSummary) return offerIdToHex(offerSummary.id);
        return undefined;
      })
      .filter(isDefined)
      .join(", ");
    if (!label) return;

    const address = isSellOffer(offer)
      ? offer.returnAddress
      : offer.releaseAddress;

    useWalletState.getState().labelAddress(address, label);
  });
}
