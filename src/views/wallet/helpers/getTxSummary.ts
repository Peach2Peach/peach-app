import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { MSINASECOND } from "../../../constants";
import { useTradeSummaryStore } from "../../../store/tradeSummaryStore";
import { isBuyOffer } from "../../../utils/offer/isBuyOffer";
import { getTransactionType } from "../../../utils/transaction/getTransactionType";
import { txIsConfirmed } from "../../../utils/transaction/txIsConfirmed";

export function getTxSummary({
  tx,
  offers,
}: {
  tx: TransactionDetails;
  offers: (SellOffer | BuyOffer)[];
}): TransactionSummary {
  const type = getTransactionType(tx, offers?.[0]);
  const offerData = offers.map(mapOfferToOfferData(type));

  return {
    id: tx.txid,
    type,
    offerData,
    amount: Math.abs(tx.sent - tx.received),
    date: txIsConfirmed(tx)
      ? new Date((tx.confirmationTime?.timestamp || Date.now()) * MSINASECOND)
      : new Date(),
    height: tx.confirmationTime?.height,
    confirmed: txIsConfirmed(tx),
  };
}

function mapOfferToOfferData(type: TransactionType) {
  return (offer: SellOffer | BuyOffer) => {
    const contract = offer?.contractId
      ? useTradeSummaryStore.getState().getContract(offer?.contractId)
      : undefined;
    const address = isBuyOffer(offer)
      ? offer.releaseAddress
      : type === "ESCROWFUNDED"
        ? offer.escrow || ""
        : offer.returnAddress;

    return {
      offerId: offer.id,
      contractId: offer.contractId,
      amount:
        contract?.amount ||
        (Array.isArray(offer.amount) ? offer.amount[0] : offer.amount),
      address,
      currency: contract?.currency,
      price: contract?.price,
    };
  };
}
