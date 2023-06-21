import OpenPGP from 'react-native-fast-openpgp'

export const verify = (signature: string, message: string, publicKey: string) =>
  OpenPGP.verify(signature, message, publicKey)
