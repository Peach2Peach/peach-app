import OpenPGP from 'react-native-fast-openpgp'
import { account } from '../account'

export const signAndEncryptSymmetric = async (message: string, passphrase: string): Promise<SignAndEncryptResult> => {
  const signature = await OpenPGP.sign(message, account.pgp.publicKey, account.pgp.privateKey, '')
  const encrypted = await OpenPGP.encryptSymmetric(message, passphrase, undefined, { cipher: 2 })
  return {
    signature,
    encrypted,
  }
}
