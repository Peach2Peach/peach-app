import OpenPGP from 'react-native-fast-openpgp'
import { account } from '../account'

export const decrypt = async (encrypted: string): Promise<string> =>
  await OpenPGP.decrypt(encrypted, account.pgp.privateKey, '')
