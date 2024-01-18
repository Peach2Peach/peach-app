const MAX_SEQUENCE = 0xfffffffe
export const isRBFEnabled = (transaction: Transaction) => transaction.vin.some((v) => v.sequence < MAX_SEQUENCE)
