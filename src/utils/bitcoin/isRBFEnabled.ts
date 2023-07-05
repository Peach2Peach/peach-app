export const isRBFEnabled = (transaction: Transaction) => transaction.vin.some((v) => v.sequence < 0xfffffffe)
