import OpenPGP from 'react-native-fast-openpgp'
import { getError } from '../../../peach-api/src/utils/result'
import { decrypt } from '../../utils/pgp/decrypt'
import { decryptSymmetric } from '../../utils/pgp/decryptSymmetric'
import { getResult } from '../../utils/result/getResult'
import { Result } from '../../utils/result/types'

async function verifyPaymentDataSignature (
  paymentDataSignature: string,
  decryptedPaymentDataString: string,
  publicKey: string,
) {
  try {
    return await OpenPGP.verify(paymentDataSignature, decryptedPaymentDataString, publicKey)
  } catch (err) {
    return false
  }
}
type DecryptPaymentDataProps = Pick<Contract, 'paymentDataEncryptionMethod'> & {
  paymentDataEncrypted?: string
  paymentDataSignature: string
  user: PublicUser
}
export async function decryptPaymentData (
  { paymentDataEncrypted, paymentDataSignature, user, paymentDataEncryptionMethod }: DecryptPaymentDataProps,
  symmetricKey: string | null,
): Promise<Result<PaymentData, string | undefined>> {
  if (!paymentDataEncrypted || !paymentDataSignature) {
    return getError('MISSING_PAYMENT_DATA_SECRETS')
  }
  if (paymentDataEncryptionMethod === 'asymmetric') {
    try {
      const decryptedPaymentDataString = await decrypt(paymentDataEncrypted)
      if (!(await verifyPaymentDataSignature(paymentDataSignature, decryptedPaymentDataString, user.pgpPublicKey))) {
        return getError('PAYMENT_DATA_SIGNATURE_INVALID')
      }
      return getResult(JSON.parse(await decrypt(paymentDataEncrypted)) as PaymentData)
    } catch (e) {
      return getError('PAYMENT_DATA_ENCRYPTION_FAILED')
    }
  }
  if (!symmetricKey) return getError('MISSING_SYMMETRIC_KEY')

  try {
    const decryptedPaymentDataString = await decryptSymmetric(paymentDataEncrypted, symmetricKey)
    if (!(await verifyPaymentDataSignature(paymentDataSignature, decryptedPaymentDataString, user.pgpPublicKey))) {
      return getError('PAYMENT_DATA_SIGNATURE_INVALID')
    }
    return getResult(JSON.parse(decryptedPaymentDataString) as PaymentData)
  } catch (e) {
    return getError('SYMMETRIC_PAYMENT_DATA_ENCRYPTION_FAILED')
  }
}
