import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { BuyOffer, SellOffer } from "../../../../peach-api/src/@types/offer";
import { MSINASECOND } from "../../../constants";
import { getTransactionType } from "../../../utils/transaction/getTransactionType";
import { txIsConfirmed } from "../../../utils/transaction/txIsConfirmed";

export function getTxSummary({
  tx,
  offer,
}: {
  tx: TransactionDetails;
  offer: SellOffer | BuyOffer | undefined;
}) {
  const isConfirmed = txIsConfirmed(tx);
  return {
    id: tx.txid,
    chain: "bitcoin" as Chain,
    type: getTransactionType(tx, offer),
    amount: Math.abs(tx.sent - tx.received),
    date: isConfirmed
      ? new Date((tx.confirmationTime?.timestamp || Date.now()) * MSINASECOND)
      : new Date(),
    height: tx.confirmationTime?.height,
    confirmed: isConfirmed,
  };
}
