import CryptoJS from 'react-native-crypto-js'

/**
* @description Method to decrypt a string
* @param str string to decrypt
* @param password password to decrypt with
* @returns decrypted string
*/
export const decrypt = (str: string, password: string) =>
  CryptoJS.AES.decrypt(str, password).toString(CryptoJS.enc.Utf8)