/**
 * @description Method to build means of payment object
 * @param mops means of payment
 * @param data paymentData
 * @returns means of payment with added payment method
 * @example paymentData.reduce(dataToMeansOfPayment, {})
 */
export const dataToMeansOfPayment = (mop: MeansOfPayment, data: PaymentData) => {
  ;(data.currencies || []).forEach((currency) => {
    if (!mop[currency]) mop[currency] = []
    if (!mop[currency]!.includes(data.type)) mop[currency]!.push(data.type)
  })
  return mop
}
