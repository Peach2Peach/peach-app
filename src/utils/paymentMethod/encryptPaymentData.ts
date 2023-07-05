import { signAndEncryptSymmetric } from '../pgp'

export const encryptPaymentData = (paymentData: PaymentDataInfo, symmetricKey: string) =>
  signAndEncryptSymmetric(JSON.stringify(paymentData), symmetricKey)
