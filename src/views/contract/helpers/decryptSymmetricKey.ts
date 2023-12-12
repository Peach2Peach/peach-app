import OpenPGP from 'react-native-fast-openpgp'
import { decrypt } from '../../../utils/pgp'

export const decryptSymmetricKey = async (
  symmetricKeyEncrypted: string,
  symmetricKeySignature: string,
  pgpPublicKey: string,
) => {
  let symmetricKey
  try {
    symmetricKey = await decrypt(symmetricKeyEncrypted)
    if (!(await OpenPGP.verify(symmetricKeySignature, symmetricKey, pgpPublicKey))) {
      return symmetricKey
    }
  } catch (err) {
    return null
  }

  return symmetricKey
}
