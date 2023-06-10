export const somePaymentDataExists = (data: PaymentData) =>
  Object.keys(data)
    .filter((key) => !/id|label|type|currencies/u.test(key))
    .some((key) => data[key])
