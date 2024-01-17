import OpenPGP from 'react-native-fast-openpgp'
import { useAccountStore } from '../account/account'

export const decrypt = (encrypted: string) => {
  const { privateKey } = useAccountStore.getState().account.pgp
  return OpenPGP.decrypt(encrypted, privateKey, '')
}
