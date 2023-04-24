import { error } from '../../../utils/log'
import { decrypt, verify } from '../../../utils/pgp'

export const decryptSymmetricKey = async (
  symmetricKeyEncrypted: string,
  symmetricKeySignature: string,
  pgpPublicKey: string,
): Promise<[string | null, string | null]> => {
  let symmetricKey
  try {
    symmetricKey = await decrypt(symmetricKeyEncrypted)
    if (!(await verify(symmetricKeySignature, symmetricKey, pgpPublicKey))) {
      error('INVALID_SIGNATURE')
      return [symmetricKey, 'INVALID_SIGNATURE']
    }
  } catch (err) {
    error(new Error('DECRYPTION_FAILED'))
    return [null, 'DECRYPTION_FAILED']
  }

  return [symmetricKey, null]
}
