import { ceil } from '../math'

export const getTransactionFeeRate = (transaction: Transaction) =>
  Math.max(1, ceil((transaction.fee || 0) / (transaction.weight / 4), 2))
