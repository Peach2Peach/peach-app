import { TxDetails } from "bdk-rn";
import { MSINASECOND } from "../../../constants";
import { txIsConfirmed } from "../../../utils/transaction/txIsConfirmed";

export function getTxSummary(tx: TxDetails) {
  const isConfirmed = txIsConfirmed(tx);

  let blockConfirmationTimestamp: undefined | number
  let blockConfirmationHeight: undefined | number

  const inner = tx.chainPosition.inner;
  if ("confirmationBlockTime" in inner) {
    blockConfirmationTimestamp = Number(inner.confirmationBlockTime.confirmationTime);
    blockConfirmationHeight = inner.confirmationBlockTime.blockId.height
  }


  return {
    id: tx.txid,
    amount: Math.abs(Number(tx.sent.toSat() - tx.received.toSat())), //TODO: check if tx.balanceDelta is good enough
    date: (isConfirmed && blockConfirmationTimestamp)
      ? new Date((blockConfirmationTimestamp || Date.now()) * MSINASECOND)
      : new Date(),
    height: blockConfirmationHeight,
    confirmed: isConfirmed,
  };
}
