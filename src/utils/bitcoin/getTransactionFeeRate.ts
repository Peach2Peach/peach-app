import { ceil } from '../math/ceil'

const WEIGHT_UNITS_PER_VBYTE = 4
export const getTransactionFeeRate = (transaction: Transaction) =>
  Math.max(1, ceil((transaction.fee || 0) / (transaction.weight / WEIGHT_UNITS_PER_VBYTE), 2))
