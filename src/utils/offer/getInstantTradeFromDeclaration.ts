import { hasValidSignature } from "../../views/contract/helpers/hasValidSignature";
import { getInstantTradeDeclarationMessage } from "../account/getInstantTradeDeclarationMessage";
import { getProvenPgpPublicKeys } from "../account/getProvenPgpPublicKeys";
import { isValidPeachUserSignature } from "../account/isValidPeachUserSignature";

/**
 * @description reads whether a sell offer was instant trade from the seller's
 * own signed declaration. The declaration may be signed either with the
 * seller's Peach ID key (bitcoin message signature) or with one of the
 * seller's PGP keys, as long as the seller proved owning that key. Both sentences are tried: exactly one must verify.
 * Throws INVALID_INSTANT_TRADE_DECLARATION otherwise, which means the
 * declaration is missing, belongs to another offer or user, or is corrupt.
 */
export const getInstantTradeFromDeclaration = async ({
  offerId,
  sellerId,
  sellerPgpPublicKeys,
  instantTradeSignature,
}: {
  offerId: string;
  /** the seller's Peach ID public key (user id) */
  sellerId: string;
  /** the seller's PGP public keys with their ownership proofs, for a PGP
   * signed declaration. Keys without a valid proof are ignored. */
  sellerPgpPublicKeys: PGPPublicKeyProofPair[];
  instantTradeSignature?: string | null;
}): Promise<boolean> => {
  if (!instantTradeSignature)
    throw new Error("INVALID_INSTANT_TRADE_DECLARATION");

  const messages = [true, false].map((isInstant) =>
    getInstantTradeDeclarationMessage(sellerId, offerId, isInstant),
  );

  let [isInstantValid, isNotInstantValid] = messages.map((message) =>
    isValidPeachUserSignature(message, sellerId, instantTradeSignature),
  );

  // not a valid Peach ID signature for either sentence: try the PGP keys
  // the seller proved owning
  if (!isInstantValid && !isNotInstantValid) {
    const publicKeys = getProvenPgpPublicKeys({
      userId: sellerId,
      pgpPublicKeys: sellerPgpPublicKeys,
    });
    [isInstantValid, isNotInstantValid] = await Promise.all(
      messages.map((message) =>
        hasValidSignature({
          signature: instantTradeSignature,
          message,
          publicKeys,
        }),
      ),
    );
  }

  if (isInstantValid === isNotInstantValid)
    throw new Error("INVALID_INSTANT_TRADE_DECLARATION");
  return isInstantValid;
};
