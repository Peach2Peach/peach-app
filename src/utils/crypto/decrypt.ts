import CryptoJS from "react-native-crypto-js";

export const decrypt = (str: string, password: string) =>
  CryptoJS.AES.decrypt(str, password).toString(CryptoJS.enc.Utf8);
