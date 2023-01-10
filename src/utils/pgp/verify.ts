import OpenPGP from 'react-native-fast-openpgp'

export const verify = async (signature: string, message: string, publicKey: string): Promise<boolean> =>
  await OpenPGP.verify(signature, message, publicKey)
