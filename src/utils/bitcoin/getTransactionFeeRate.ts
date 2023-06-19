import { round } from '../math'

export const getTransactionFeeRate = (transaction: Transaction) =>
  Math.max(1, round((transaction.fee || 0) / (transaction.weight / 4), 2))
