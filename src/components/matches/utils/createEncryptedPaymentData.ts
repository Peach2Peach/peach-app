import { encryptPaymentData } from '../../../utils/paymentMethod'
import { decryptSymmetricKey } from '../../../views/contract/helpers/decryptSymmetricKey'

export const createEncryptedPaymentData = async (match: Match, paymentDataForMethod: PaymentData) => {
  const [symmetricKey] = await decryptSymmetricKey(
    match.symmetricKeyEncrypted,
    match.symmetricKeySignature,
    match.user.pgpPublicKey,
  )

  if (!symmetricKey) return undefined

  return encryptPaymentData(paymentDataForMethod, symmetricKey)
}
