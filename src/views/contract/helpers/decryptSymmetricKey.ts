import { error } from "../../../utils/log/error";
import { log } from "../../../utils/log/log";
import { decrypt } from "../../../utils/pgp/decrypt";
import { hasValidSignature } from "./hasValidSignature";

/**
 * @description decrypts the symmetric key and checks it was signed by one of
 * the given (proven) PGP keys. Anyone can encrypt a key to our public key, so
 * the signature is what proves the key came from the other party: when it is
 * invalid the key is rejected (null), and nothing gets encrypted or decrypted
 * with a key someone else may know.
 */
export const decryptSymmetricKey = async (
  symmetricKeyEncrypted: string,
  symmetricKeySignature: string,
  pgpPublicKeys: { publicKey: string }[],
) => {
  let symmetricKey: string;
  try {
    symmetricKey = await decrypt(symmetricKeyEncrypted);

    log("successfully decrypted symmetric key");
    const isValid = await hasValidSignature({
      signature: symmetricKeySignature,
      message: symmetricKey,
      publicKeys: pgpPublicKeys,
    });
    if (!isValid) {
      error(new Error("SYMMETRIC_KEY_SIGNATURE_INVALID"));
      return null;
    }
  } catch (err) {
    return null;
  }

  return symmetricKey;
};
