import CryptoJS from "react-native-crypto-js";

/**
 * @description Method to encrypt a string
 * @param str string to encrypt
 * @param password password to encrypt with
 * @returns encrypted string
 */
export const encrypt = (str: string, password: string) =>
  CryptoJS.AES.encrypt(str, password).toString();
