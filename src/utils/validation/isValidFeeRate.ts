export const isValidFeeRate = (feeRate: string) => /^[0-9.]*$/u.test(feeRate) && Number(feeRate) >= 1
