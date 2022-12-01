/**
 * @description Method to check whether payment data (not metadata) exists
 * @param data payment data
 * @returns true if at least some payment data exists
 */
export const somePaymentDataExists = (data: PaymentData) =>
  Object.keys(data)
    .filter((key) => !/id|label|type|currencies/u.test(key))
    .some((key) => data[key])
