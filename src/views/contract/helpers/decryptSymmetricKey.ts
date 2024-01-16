import OpenPGP from 'react-native-fast-openpgp'
import { error } from '../../../utils/log/error'
import { decrypt } from '../../../utils/pgp/decrypt'

const verifyPGPSignature = async (signature: string, message: string, publicKey: string) => {
  try {
    return await OpenPGP.verify(signature, message, publicKey)
  } catch (e) {
    return false
  }
}
export const decryptSymmetricKey = async (
  symmetricKeyEncrypted: string,
  symmetricKeySignature: string,
  pgpPublicKeys: string[],
) => {
  let symmetricKey: string
  try {
    symmetricKey = await decrypt(symmetricKeyEncrypted)
    const results = await Promise.all(
      pgpPublicKeys.map((publicKey) => verifyPGPSignature(symmetricKeySignature, symmetricKey, publicKey)),
    )
    console.log(results)
    if (results.some((r) => r)) return symmetricKey
    error(new Error('SYMMETRIC_KEY_SIGNATURE_INVALID'))
  } catch (err) {
    error(err)
    return null
  }

  return symmetricKey
}
