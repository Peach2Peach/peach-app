import ecc from "@bitcoinerlab/secp256k1";
import { crypto } from "bitcoinjs-lib";

/**
 * @description verifies a Peach ID signature: ECDSA over sha256(utf8 message),
 * compact hex, by the key behind the user id (the user id is that public key).
 * Never throws: anything malformed is just invalid.
 */
export const isValidPeachUserSignature = (
  message: string,
  userId: string,
  signature: string,
) => {
  try {
    return ecc.verify(
      crypto.sha256(Buffer.from(message, "utf8")),
      Buffer.from(userId, "hex"),
      Buffer.from(signature, "hex"),
    );
  } catch {
    return false;
  }
};
