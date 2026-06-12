import { crypto } from "bitcoinjs-lib";
import OpenPGP from "react-native-fast-openpgp";
import {
  EncryptedDataBlob,
  SubmittedEncryptedBlob,
} from "../../../peach-api/src/@types/pgpKeyRotation";
import { info } from "../log/info";
import { peachAPI } from "../peachAPI";
import { signAndEncryptToKeys } from "./signAndEncryptToKeys";

export type PgpMigrationResult =
  | { status: "migrated" }
  | { status: "alreadyMigrated" }
  | { status: "error"; error: string };

const reEncryptBlob = async (
  blob: EncryptedDataBlob,
  newPgp: PGPKeychain,
  oldPrivateKey: string,
): Promise<SubmittedEncryptedBlob | null> => {
  let plaintext: string;
  try {
    plaintext = await OpenPGP.decrypt(blob.encrypted, oldPrivateKey, "");
  } catch {
    // This piece of data is encrypted to a key that is not our current main key,
    // so we cannot re-encrypt it. Skip it — the server accepts partial
    // submissions and leaves the untouched data as-is.
    info("[pgpMigration] skipping blob we cannot decrypt", blob.source);
    return null;
  }

  // Shared blobs (contracts, performed trade requests) must be re-encrypted to
  // the new key AND the current non-user recipients (counterparty/offer owner,
  // + Peach for instant trades) the server reported, or the server rejects them.
  // Own-only blobs go to the new key alone.
  const recipients =
    "recipientPgpPublicKeys" in blob
      ? [newPgp.publicKey, ...blob.recipientPgpPublicKeys]
      : [newPgp.publicKey];

  const { signature, encrypted } = await signAndEncryptToKeys(
    plaintext,
    recipients,
    newPgp.privateKey,
  );

  switch (blob.source) {
    case "user69":
      return { source: "user69", field: blob.field, encrypted, signature };
    case "offer":
      return {
        source: "offer",
        offerId: blob.offerId,
        paymentMethod: blob.paymentMethod,
        encrypted,
        signature,
      };
    case "buyOffer69":
      return {
        source: "buyOffer69",
        buyOfferId: blob.buyOfferId,
        paymentMethod: blob.paymentMethod,
        encrypted,
        signature,
      };
    case "contract":
      return {
        source: "contract",
        contractId: blob.contractId,
        field: blob.field,
        encrypted,
        signature,
      };
    case "buyOfferTradeRequest":
    case "sellOfferTradeRequest":
      return {
        source: blob.source,
        tradeRequestId: blob.tradeRequestId,
        encrypted,
        signature,
      };
    default:
      throw new Error("unknown blob source");
  }
};

/**
 * @description Performs the one-time, data-preserving PGP key rotation against
 * the server: fetches every blob currently encrypted to the old key, decrypts
 * each with `oldPrivateKey`, re-encrypts to `newPgp` (and the reported recipients
 * for shared contract blobs), signs with the new key, and submits the rotation.
 * Does not touch local state — the caller swaps the local key on success.
 */
export const performPgpKeyMigration = async ({
  newPgp,
  oldPrivateKey,
}: {
  newPgp: PGPKeychain;
  oldPrivateKey: string;
}): Promise<PgpMigrationResult> => {
  const peachAccount = peachAPI.apiOptions.peachAccount;
  if (!peachAccount) return { status: "error", error: "UNAUTHORIZED" };

  const { result: encryptedData, error: fetchError } =
    await peachAPI.private.peach069.getEncryptedDataOnSelfUser69();
  if (fetchError || !encryptedData) {
    return { status: "error", error: fetchError?.error || "GET_FAILED" };
  }
  if (encryptedData.alreadyMigrated) return { status: "alreadyMigrated" };

  const reEncrypted = await Promise.all(
    encryptedData.blobs.map((blob) =>
      reEncryptBlob(blob, newPgp, oldPrivateKey),
    ),
  );
  // Drop blobs we couldn't decrypt (encrypted to a non-main key); the server
  // accepts a partial submission and leaves them untouched.
  const blobs = reEncrypted.filter(
    (blob): blob is SubmittedEncryptedBlob => blob !== null,
  );

  const message = `Peach new PGP key ${new Date().getTime()}`;
  const pgpSignature = await OpenPGP.sign(message, newPgp.privateKey, "");
  const signature = peachAccount
    .sign(crypto.sha256(Buffer.from(newPgp.publicKey)))
    .toString("hex");

  const { result, error: rotateError } =
    await peachAPI.private.peach069.rotatePgpKeyOnSelfUser69({
      pgpPublicKey: newPgp.publicKey,
      signature,
      message,
      pgpSignature,
      generatedAt: encryptedData.generatedAt,
      blobs,
    });

  if (rotateError || !result) {
    return { status: "error", error: rotateError?.error || "ROTATE_FAILED" };
  }
  return { status: "migrated" };
};
