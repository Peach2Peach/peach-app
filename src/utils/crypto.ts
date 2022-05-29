import * as bitcoin from 'bitcoinjs-lib'
const { randomBytes } = require('react-native-randombytes')
import CryptoJS from 'react-native-crypto-js'
import { error } from './log'

export let wallet: bitcoin.bip32.BIP32Interface

/**
 * @description Method to reverse buffer
 * @param buffer buffer to reverse
 * @returns reversed buffer
 */
export const reverseBuffer = (buffer: Buffer): Buffer => {
  if (buffer.length < 1) return buffer
  let j = buffer.length - 1
  let tmp = 0
  for (let i = 0; i < buffer.length / 2; i++) {
    tmp = buffer[i]
    buffer[i] = buffer[j]
    buffer[j] = tmp
    j--
  }
  return buffer
}

/**
 * @description Method to generate random bytes
 * @param count length of random bytes
 * @returns random bytes
 */
export const getRandom = (count: number): Promise<Buffer> => new Promise((resolve, reject) =>
  randomBytes(count, (err: any, bytes: Buffer) => {
    if (err) {
      error(err)
      reject(err)
    } else {
      resolve(bytes)
    }
  }))

/**
 * @description Method to hash a string into hex representation using sha256
 * @param str string to hash
 * @returns hashed string as hex
 */
export const sha256 = (str: string): string => bitcoin.crypto.sha256(Buffer.from(str)).toString('hex')

/**
 * @description Method to encrypt a string
 * @param str string to encrypt
 * @param password password to encrypt with
 * @returns encrypted string
 */
export const encrypt = (str: string, password: string) =>
  CryptoJS.AES.encrypt(str, password).toString()

/**
 * @description Method to decrypt a string
 * @param str string to decrypt
 * @param password password to decrypt with
 * @returns decrypted string
 */
export const decrypt = (str: string, password: string) =>
  CryptoJS.AES.decrypt(str, password).toString(CryptoJS.enc.Utf8)