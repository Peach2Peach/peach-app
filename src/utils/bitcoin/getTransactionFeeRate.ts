import { TxDetails } from "bdk-rn";
import { ceil } from "../math/ceil";

export async function getTransactionFeeRate(transaction: TxDetails) {
  const feeRate = transaction.feeRate;
  if (!feeRate || feeRate < 1) return 1;

  console.log("real fee rate", feeRate);

  return ceil(feeRate, 2);
}
