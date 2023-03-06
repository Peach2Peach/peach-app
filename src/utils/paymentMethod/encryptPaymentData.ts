import { signAndEncryptSymmetric } from '../pgp'

/**
 * @description Method to encrypt payment data and sign encrypted payment data with passphrase
 * @param paymentData payment data
 * @param passphrase passphrase to encrypt with
 * @returns Promise resolving to encrypted payment data and signature
 */
export const encryptPaymentData = async (
  paymentData: PaymentData,
  symmetricKey: string,
): Promise<SignAndEncryptResult> => {
  const data = JSON.parse(JSON.stringify(paymentData))

  delete data.id
  delete data.label
  delete data.type
  delete data.currencies

  return await signAndEncryptSymmetric(JSON.stringify(data), symmetricKey)
}
