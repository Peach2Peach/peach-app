import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { ceil } from "../math/ceil";

export async function getTransactionFeeRate(transaction: TransactionDetails) {
  const vSize = await transaction.transaction?.vsize();
  if (!vSize) return 1;
  return Math.max(1, ceil((transaction.fee || 0) / vSize, 2));
}
