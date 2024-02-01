import { error } from '../../../utils/log/error'
import { decrypt } from '../../../utils/pgp/decrypt'
import { hasValidSignature } from './hasValidSignature'

export const decryptSymmetricKey = async (
  symmetricKeyEncrypted: string,
  symmetricKeySignature: string,
  pgpPublicKeys: { publicKey: string }[],
) => {
  let symmetricKey: string
  try {
    symmetricKey = await decrypt(symmetricKeyEncrypted)
    const isValid = await hasValidSignature(
      {
        signature: symmetricKeySignature,
        message: symmetricKey,
        publicKeys: pgpPublicKeys,
      },
    )
    if (!isValid) error(new Error('SYMMETRIC_KEY_SIGNATURE_INVALID'))
  } catch (err) {
    error(err)
    return null
  }

  return symmetricKey
}
