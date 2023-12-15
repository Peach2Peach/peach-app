import OpenPGP from 'react-native-fast-openpgp'
import { useAccountStore } from '../account/account'

export const signAndEncrypt = async (message: string, publicKey: string) => {
  const account = useAccountStore.getState().account
  const [signature, encrypted] = await Promise.all([
    OpenPGP.sign(message, account.pgp.privateKey, ''),
    OpenPGP.encrypt(message, publicKey),
  ])
  return { signature, encrypted }
}
