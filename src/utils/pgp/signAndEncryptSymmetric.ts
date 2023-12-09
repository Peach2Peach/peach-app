import OpenPGP from 'react-native-fast-openpgp'
import { useAccountStore } from '../account/account'

export const signAndEncryptSymmetric = async (message: string, passphrase: string) => {
  const account = useAccountStore.getState().account
  const signature = await OpenPGP.sign(message, account.pgp.publicKey, account.pgp.privateKey, '')
  const encrypted = await OpenPGP.encryptSymmetric(message, passphrase, undefined, { cipher: 2 })
  return {
    signature,
    encrypted,
  }
}
