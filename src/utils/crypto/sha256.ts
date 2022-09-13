import { crypto } from 'bitcoinjs-lib'

/**
 * @description Method to hash a string into hex representation using sha256
 * @param str string to hash
 * @returns hashed string as hex
 */
export const sha256 = (str: string): string => crypto.sha256(Buffer.from(str)).toString('hex')
