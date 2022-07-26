/**
 * @description Method to determine whether payment data is valid
 * @param data payment data
 * @returns true if payment data is valid
 * @TODO check actual fields for validity
 */
export const isValidPaymentdata = (data: PaymentData) => {
  const dataKeys = Object.keys(data).filter(key => !/id|label|type|currencies/u.test(key))
  return dataKeys.some(key => data[key])
}