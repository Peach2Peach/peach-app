import OpenPGP from 'react-native-fast-openpgp'
import { account } from '../account'

export const decrypt = (encrypted: string) => OpenPGP.decrypt(encrypted, account.pgp.privateKey, '')
