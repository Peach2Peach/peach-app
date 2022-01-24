import * as bitcoin from 'bitcoinjs-lib'
const { randomBytes } = require('react-native-randombytes')

export let wallet: bitcoin.bip32.BIP32Interface

/**
 * @description Method to generate random bytes
 * @param count length of random bytes
 * @returns random bytes
 */
export const getRandom = (count: number): Promise<Buffer> => new Promise((resolve, reject) =>
  randomBytes(count, (err: any, bytes: Buffer) => {
    if (err) reject(err)
    else resolve(bytes)
  }))

/**
 * @description Method to hash a string into hex representation using sha256
 * @param str string to hash
 * @returns hashed string as hex
 */
export const sha256 = (str: string): string => bitcoin.crypto.sha256(Buffer.from(str)).toString('hex')