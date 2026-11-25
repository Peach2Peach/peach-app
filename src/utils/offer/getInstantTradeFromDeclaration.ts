import { getInstantTradeDeclarationMessage } from "../account/getInstantTradeDeclarationMessage";
import { isValidPeachUserSignature } from "../account/isValidPeachUserSignature";

/**
 * @description reads whether a sell offer was instant trade from the seller's
 * own signed declaration. Both sentences are tried: exactly one must verify.
 * Throws INVALID_INSTANT_TRADE_DECLARATION otherwise, which means the
 * declaration is missing, belongs to another offer or user, or is corrupt.
 */
export const getInstantTradeFromDeclaration = ({
  offerId,
  sellerId,
  instantTradeSignature,
}: {
  offerId: string;
  /** the seller's Peach ID public key (user id) */
  sellerId: string;
  instantTradeSignature?: string | null;
}): boolean => {
  if (!instantTradeSignature)
    throw new Error("INVALID_INSTANT_TRADE_DECLARATION");

  const [isInstantValid, isNotInstantValid] = [true, false].map((isInstant) =>
    isValidPeachUserSignature(
      getInstantTradeDeclarationMessage(sellerId, offerId, isInstant),
      sellerId,
      instantTradeSignature,
    ),
  );

  if (isInstantValid === isNotInstantValid)
    throw new Error("INVALID_INSTANT_TRADE_DECLARATION");
  return isInstantValid;
};
