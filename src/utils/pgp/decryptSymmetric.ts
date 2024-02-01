import OpenPGP from "react-native-fast-openpgp";

export const decryptSymmetric = (encrypted: string, passphrase: string) =>
  OpenPGP.decryptSymmetric(encrypted, passphrase, { cipher: 2 });
