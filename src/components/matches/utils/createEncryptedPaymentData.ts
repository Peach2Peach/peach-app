import { encryptPaymentData } from '../../../utils/paymentMethod'
import { decryptSymmetricKey } from '../../../views/contract/helpers/parseContract'

export const createEncryptedPaymentData = async (match: Match, paymentDataForMethod: PaymentData) => {
  const [symmetricKey] = await decryptSymmetricKey(
    match.symmetricKeyEncrypted,
    match.symmetricKeySignature,
    match.user.pgpPublicKey,
  )

  return encryptPaymentData(paymentDataForMethod, symmetricKey)
}
