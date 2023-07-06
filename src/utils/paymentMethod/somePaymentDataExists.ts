import { keys } from '../object'

const metadata = ['id', 'label', 'type', 'currencies']
export const somePaymentDataExists = (data: PaymentData) =>
  keys(data)
    .filter((key) => !metadata.includes(key))
    .some((key) => data[key])
