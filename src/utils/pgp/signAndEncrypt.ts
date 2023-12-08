import OpenPGP from 'react-native-fast-openpgp'
import { useAccountStore } from '../account/account'

export const signAndEncrypt = async (message: string, publicKey: string) => {
  const account = useAccountStore.getState().account
  const signature = await OpenPGP.sign(message, account.pgp.publicKey, account.pgp.privateKey, '')
  const encrypted = await OpenPGP.encrypt(message, publicKey)
  return {
    signature,
    encrypted,
  }
}
