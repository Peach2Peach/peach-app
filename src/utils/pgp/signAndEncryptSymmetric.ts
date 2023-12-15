import OpenPGP from 'react-native-fast-openpgp'
import { useAccountStore } from '../account/account'

export const signAndEncryptSymmetric = async (message: string, passphrase: string) => {
  const account = useAccountStore.getState().account
  const [signature, encrypted] = await Promise.all([
    OpenPGP.sign(message, account.pgp.publicKey, account.pgp.privateKey),
    OpenPGP.encryptSymmetric(message, passphrase, undefined, { cipher: 2 }),
  ])
  return { signature, encrypted }
}
