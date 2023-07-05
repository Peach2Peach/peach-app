import { encryptPaymentData } from '../../../utils/paymentMethod'
import { decryptSymmetricKey } from '../../../views/contract/helpers'

export const createEncryptedPaymentData = async (match: Match, paymentDataInfo: PaymentDataInfo) => {
  const [symmetricKey] = await decryptSymmetricKey(
    match.symmetricKeyEncrypted,
    match.symmetricKeySignature,
    match.user.pgpPublicKey,
  )

  if (!symmetricKey) return undefined

  return encryptPaymentData(paymentDataInfo, symmetricKey)
}
