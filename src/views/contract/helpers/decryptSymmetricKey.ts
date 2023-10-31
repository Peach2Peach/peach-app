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
      return [symmetricKey, 'INVALID_SIGNATURE']
    }
  } catch (err) {
    return [null, 'DECRYPTION_FAILED']
  }

  return [symmetricKey, null]
}
