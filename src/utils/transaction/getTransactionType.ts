import { OfferSummary } from "../../../peach-api/src/@types/offer";
import { WalletTransaction } from "../wallet/WalletTransaction";

export const getTransactionType = (
  txDetails: Pick<WalletTransaction, "received" | "sent">,
  offer?: Pick<OfferSummary, "type">,
): TransactionType => {
  const received = Number(txDetails.received);
  const sent = Number(txDetails.sent);

  if (offer) {
    if (received > 0 && sent === 0)
      return offer.type === "ask" ? "REFUND" : "TRADE";
    if (sent > 0 && offer.type === "ask") return "ESCROWFUNDED";
  }

  return sent === 0 ? "DEPOSIT" : "WITHDRAWAL";
};
