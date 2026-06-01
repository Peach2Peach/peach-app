import type { WalletTx } from "../wallet/bdkShim";
import { ceil } from "../math/ceil";

export function getTransactionFeeRate(transaction: WalletTx) {
  const vSize = transaction.transaction?.vsize;
  if (!vSize) return 1;
  return Math.max(1, ceil((transaction.fee || 0) / vSize, 2));
}
