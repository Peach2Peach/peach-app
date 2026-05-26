import { MSINASECOND } from "../../../constants";
import { txIsConfirmed } from "../../../utils/transaction/txIsConfirmed";
import type { WalletTx } from "../../../utils/wallet/bdkShim";

export function getTxSummary(tx: WalletTx) {
  const isConfirmed = txIsConfirmed(tx);
  return {
    id: tx.txid,
    amount: Math.abs(tx.sent - tx.received),
    date: isConfirmed
      ? new Date((tx.confirmationTime?.timestamp || Date.now()) * MSINASECOND)
      : new Date(),
    height: tx.confirmationTime?.height,
    confirmed: isConfirmed,
  };
}
