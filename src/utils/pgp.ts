import OpenPGP from 'react-native-fast-openpgp'
import { account } from './account'

export type SignAndEncryptResult = {
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
 * @description Method to encrypt message and sign encrypted message with passphrase
 * @param message message to encrypt
 * @param passphrase passphrase to encrypt with
 * @returns Promise resolving to encrypted message and signature
 */
export const signAndEncryptSymmetric = async (message: string, passphrase: string): Promise<SignAndEncryptResult> => {
  const signature = await OpenPGP.sign(message, account.pgp.publicKey, account.pgp.privateKey, '')
  const encrypted = await OpenPGP.encryptSymmetric(message, passphrase, undefined, { cipher: 2 })
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
 * @description Method to decrypt message with passphrase
 * @param encrypted encrypted message
 * @returns Promise resolving to decrypted message
 */
export const decryptSymmetric = async (encrypted: string, passphrase: string): Promise<string> =>
  await OpenPGP.decryptSymmetric(encrypted, passphrase, { cipher: 2 })


/**
 * @description Method to verify signature of message
 * @param message signed message
 * @returns Promise resolving to true if signature is real
 */
export const verify = async (signature: string, message: string, publicKey: string): Promise<boolean> =>
  await OpenPGP.verify(signature, message, publicKey)