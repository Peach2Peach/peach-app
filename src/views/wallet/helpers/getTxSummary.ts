import { MSINASECOND } from "../../../constants";
import { WalletTransaction } from "../../../utils/wallet/WalletTransaction";

export function getTxSummary(tx: WalletTransaction) {
  const isConfirmed = Boolean(tx.confirmationTime);

  const blockConfirmationTimestamp = tx.confirmationTime && tx.confirmationTime.timestamp
  const blockConfirmationHeight= tx.confirmationTime && tx.confirmationTime.height

  // const inner = tx.chainPosition.inner;
  // if ("confirmationBlockTime" in inner) {
  //   blockConfirmationTimestamp = Number(
  //     inner.confirmationBlockTime.confirmationTime,
  //   );
  //   blockConfirmationHeight = inner.confirmationBlockTime.blockId.height;
  // }

  return {
    id: tx.txid,
    amount: Math.abs(Number(tx.sent - tx.received)),
    date:
      isConfirmed && blockConfirmationTimestamp
        ? new Date((blockConfirmationTimestamp || Date.now()) * MSINASECOND)
        : new Date(),
    height: blockConfirmationHeight,
    confirmed: isConfirmed,
  };
}
