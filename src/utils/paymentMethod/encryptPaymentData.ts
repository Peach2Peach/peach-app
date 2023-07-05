import { signAndEncryptSymmetric } from '../pgp'

export const encryptPaymentData = (paymentData: PaymentData, symmetricKey: string) => {
  const data = JSON.parse(JSON.stringify(paymentData))

  delete data.id
  delete data.label
  delete data.type
  delete data.currencies

  return signAndEncryptSymmetric(JSON.stringify(data), symmetricKey)
}
