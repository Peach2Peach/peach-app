import OpenPGP from 'react-native-fast-openpgp'
import { account } from './account'

type SignAndEncryptResult = {
  signature: string,
  encrypted: string,
}

/**
 * @description Method to encrypt message and sign encrypted message
 * @param message message to encrypt
 * @returns Promise resolving to encrypted message and signature
 */
export const signAndEncrypt = async (message: string, publicKey: string): Promise<SignAndEncryptResult> => {
  const signature = await OpenPGP.sign(message, account.pgp.publicKey, account.pgp.privateKey, '')
  const encrypted = await OpenPGP.encrypt(message, publicKey)
  return {
    signature,
    encrypted,
  }
}

/**
 * @description Method to decrypt message
 * @param encrypted encrypted message
 * @returns Promise resolving to decrypted message
 */
export const decrypt = async (encrypted: string): Promise<string> =>
  await OpenPGP.decrypt(encrypted, account.pgp.privateKey, '')


/**
 * @description Method to verify signature of message
 * @param message signed message
 * @returns Promise resolving to true if signature is real
 */
export const verify = async (signature: string, message: string, publicKey: string): Promise<boolean> =>
  await OpenPGP.verify(signature, message, publicKey)