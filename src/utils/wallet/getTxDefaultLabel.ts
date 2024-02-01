import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { useTradeSummaryStore } from "../../store/tradeSummaryStore";
import { contractIdToHex } from "../contract/contractIdToHex";
import { offerIdToHex } from "../offer/offerIdToHex";
import { isDefined } from "../validation/isDefined";
import { useWalletState } from "./walletStore";

export const getTxDefaultLabel = (tx: TransactionDetails) => {
  const offerIds = useWalletState.getState().txOfferMap[tx.txid] || [];
  const offers = offerIds.map(useTradeSummaryStore.getState().getOffer);

  const labels = offers
    .map((offer) => {
      const contract = offer?.contractId
        ? useTradeSummaryStore.getState().getContract(offer?.contractId)
        : undefined;

      if (contract) return contractIdToHex(contract.id);
      if (offer) return offerIdToHex(offer.id);
      return undefined;
    })
    .filter(isDefined);

  return labels.join(", ");
};
