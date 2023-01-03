import OpenPGP from 'react-native-fast-openpgp'

export const decryptSymmetric = async (encrypted: string, passphrase: string): Promise<string> =>
  await OpenPGP.decryptSymmetric(encrypted, passphrase, { cipher: 2 })
