import OpenPGP from 'react-native-fast-openpgp'
import { error } from '../../../utils/log'
import { decrypt } from '../../../utils/pgp/decrypt'

export const decryptSymmetricKey = async (
  symmetricKeyEncrypted: string,
  symmetricKeySignature: string,
  pgpPublicKey: string,
) => {
  let symmetricKey
  try {
    symmetricKey = await decrypt(symmetricKeyEncrypted)
    if (await OpenPGP.verify(symmetricKeySignature, symmetricKey, pgpPublicKey)) {
      return symmetricKey
    }
    error(new Error('SYMMETRIC_KEY_SIGNATURE_INVALID'))
  } catch (err) {
    error(err)
    return null
  }

  return symmetricKey
}
