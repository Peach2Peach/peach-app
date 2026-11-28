import { getProvenPgpPublicKeys } from "../../../utils/account/getProvenPgpPublicKeys";
import OpenPGP from "react-native-fast-openpgp";
import { useAccountStore } from "../../../utils/account/account";
import { decrypt } from "../../../utils/pgp/decrypt";
import { hasValidSignature } from "../../contract/helpers/hasValidSignature";
import { TradeDetails } from "./createEncryptedTradeDetails";

const INVALID_TRADE_DETAILS = "InvalidTradeDetailsError";

/** thrown when the seller must not countersign the trade details */
export class InvalidTradeDetailsError extends Error {
  name = INVALID_TRADE_DETAILS;
}

// checked by name: instanceof on Error subclasses is unreliable once transpiled
export const isInvalidTradeDetailsError = (e: unknown) =>
  e instanceof Error && e.name === INVALID_TRADE_DETAILS;

type Expected = {
  /** the seller's own user id (public key) */
  seller: string;
  /** the user id of the buyer whose trade request is being accepted */
  buyer: string;
  offerId: string;
  amount: number;
  paymentMethod: string;
  currency: string;
};

/**
 * The seller decrypts the buyer's trade details, checks they are authentic and
 * describe this trade, then signs the plaintext with their own PGP key.
 * Returns an armored detached PGP signature over the exact plaintext.
 * Throws InvalidTradeDetailsError when anything does not check out, so the
 * seller never countersigns details they did not agree to.
 */
export const countersignEncryptedTradeDetails = async ({
  encryptedTradeDetails,
  encryptedTradeDetailsBuyerSignature,
  buyerPgpPublicKeys,
  expected,
}: {
  encryptedTradeDetails?: string;
  encryptedTradeDetailsBuyerSignature?: string;
  /** the buyer's keys with their ownership proofs: unproven keys are ignored */
  buyerPgpPublicKeys: PGPPublicKeyProofPair[];
  expected: Expected;
}) => {
  if (!encryptedTradeDetails || !encryptedTradeDetailsBuyerSignature)
    throw new InvalidTradeDetailsError("trade details missing");

  let plaintext: string;
  try {
    plaintext = await decrypt(encryptedTradeDetails);
  } catch (e) {
    throw new InvalidTradeDetailsError("could not decrypt trade details");
  }

  const buyerSignatureValid = await hasValidSignature({
    signature: encryptedTradeDetailsBuyerSignature,
    message: plaintext,
    publicKeys: getProvenPgpPublicKeys({
      userId: expected.buyer,
      pgpPublicKeys: buyerPgpPublicKeys,
    }),
  });
  if (!buyerSignatureValid)
    throw new InvalidTradeDetailsError("invalid buyer signature");

  let details: Partial<TradeDetails>;
  try {
    details = JSON.parse(plaintext);
  } catch (e) {
    throw new InvalidTradeDetailsError("trade details are not valid JSON");
  }

  const mismatches = [
    details.seller !== expected.seller && "seller",
    details.buyer !== expected.buyer && "buyer",
    details.offerId !== Number(expected.offerId) && "offerId",
    details.amount !== String(expected.amount) && "amount",
    details.paymentMethod !== expected.paymentMethod && "paymentMethod",
    details.currency !== expected.currency && "currency",
  ].filter(Boolean);
  if (mismatches.length)
    throw new InvalidTradeDetailsError(
      `trade details mismatch: ${mismatches.join(", ")}`,
    );

  const { privateKey } = useAccountStore.getState().account.pgp;
  return OpenPGP.sign(plaintext, privateKey, "");
};
