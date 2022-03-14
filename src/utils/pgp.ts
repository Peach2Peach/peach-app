import OpenPGP from 'react-native-fast-openpgp'
import { account } from './account'

type EncryptAndSignResult = {
  encrypted: string,
  signature: string,
}

/**
 * @description Method to encrypt message and sign encrypted message
 * @param message message to encrypt
 * @returns encrypted message and signature
 */
export const encryptAndSign = async (message: string, publicKey: string): Promise<EncryptAndSignResult> => {
  const encrypted = await OpenPGP.encrypt(message, publicKey)
  const signature = await OpenPGP.sign(encrypted, account.pgp.publicKey, account.pgp.privateKey, '')

  return {
    encrypted,
    signature,
  }
}