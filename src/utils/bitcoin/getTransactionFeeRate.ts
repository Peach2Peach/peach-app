import { ceil } from '../math/ceil'

export const getTransactionFeeRate = (transaction: Transaction) =>
  Math.max(1, ceil((transaction.fee || 0) / (transaction.weight / 4), 2))
