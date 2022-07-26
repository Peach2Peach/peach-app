/**
 * @description Method to build means of payment object
 * @param mops means of payment
 * @param currency currency
 * @returns means of payment with added currency
 * @example currencies.reduce(toMeansOfPayment, {})
 */
export const toMeansOfPayment = (mops: MeansOfPayment, currency: Currency) => {
  mops[currency] = []
  return mops
}