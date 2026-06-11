import OpenPGP from "react-native-fast-openpgp";

/**
 * @description Signs `message` (plaintext) with `privateKey` and encrypts it to
 * one or more recipient public keys. react-native-fast-openpgp reads a keyring
 * from concatenated armored public keys, so joining them encrypts to all
 * recipients (used when re-encrypting shared contract data to the new key plus
 * the counterparty/Peach during PGP key rotation).
 */
export const signAndEncryptToKeys = async (
  message: string,
  publicKeys: string[],
  privateKey: string,
) => {
  const concatenatedKeys = publicKeys.join("\n");
  const [signature, encrypted] = await Promise.all([
    OpenPGP.sign(message, privateKey, ""),
    OpenPGP.encrypt(message, concatenatedKeys),
  ]);
  return { signature, encrypted };
};
