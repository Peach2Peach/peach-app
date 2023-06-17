export const getTransactionFeeRate = (transaction: Transaction) =>
  Math.max(1, (transaction.fee || 0) / (transaction.weight / 4))
