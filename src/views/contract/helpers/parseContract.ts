import { decrypt, decryptSymmetric, verify } from '../../../utils/pgp'

export const decryptSymmetricKey = async (contract: Contract): Promise<[string, Error|null]> => {
  const symmetricKey = await decrypt(contract.symmetricKeyEncrypted)
  try {
    if (!await verify(contract.symmetricKeySignature, symmetricKey, contract.seller.pgpPublicKey)) {
      // TODO at this point we should probably cancel the order?
      // problem how can buyer app proof that the symmetric is indeed wrong?
      return [symmetricKey, new Error('INVALID_SIGNATURE')]
    }
  } catch (err) {
    return [symmetricKey, new Error('INVALID_SIGNATURE')]
  }

  return [symmetricKey, null]
}

export const getPaymentData = async (contract: Contract): Promise<[PaymentData|null, Error|null]> => {
  let decryptedPaymentData: PaymentData|null = null

  if (!contract.symmetricKey) return [null, new Error('NO_SYMMETRIC_KEY')]
  if (contract.paymentData) return [contract.paymentData, null]
  if (!contract.paymentDataEncrypted || !contract.paymentDataSignature) return [null, new Error('MISSING_PAYMENTDATA')]

  const decryptedPaymentDataString = await decryptSymmetric(contract.paymentDataEncrypted, contract.symmetricKey)
  try {
    decryptedPaymentData = JSON.parse(decryptedPaymentDataString)
  } catch (e) {
    return [decryptedPaymentData, new Error('INVALID_PAYMENTDATA')]
  }
  try {
    if (!await verify(contract.paymentDataSignature, decryptedPaymentDataString, contract.seller.pgpPublicKey)) {
      // TODO at this point we should probably cancel the order?
      // problem how can buyer app proof that the payment data is indeed wrong?
      return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
    }
  } catch (err) {
    return [decryptedPaymentData, new Error('INVALID_SIGNATURE')]
  }

  // TODO check payment data hash with actual data
  return [decryptedPaymentData, null]
}