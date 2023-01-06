import OpenPGP from 'react-native-fast-openpgp'
import { account } from '../account'

export const signAndEncrypt = async (message: string, publicKey: string): Promise<SignAndEncryptResult> => {
  const signature = await OpenPGP.sign(message, account.pgp.publicKey, account.pgp.privateKey, '')
  const encrypted = await OpenPGP.encrypt(message, publicKey)
  return {
    signature,
    encrypted,
  }
}
