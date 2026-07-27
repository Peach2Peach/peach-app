import { hashPaymentData } from "./hashPaymentData";

const HASH_PATTERN = /[0-9a-f]{64}/g;

/**
 * The contract stores payment-data hashes inconsistently: `hashedPaymentData`
 * arrives as a clean array of hash strings, but `buyerHashedPaymentData` can
 * arrive as a stringified `OfferPaymentData` object split across array elements
 * (e.g. `['{"wise":{"hashes":["<hash>"]', '"isMpesa":false}}']`). Pull every
 * 64-char hex token out so the comparison works regardless of serialization.
 */
const extractHashes = (storedHashes: string[]): string[] =>
  storedHashes.flatMap((entry) => entry.match(HASH_PATTERN) ?? []);

/**
 * Re-hashes the decrypted payment data and checks every resulting hash against
 * the hashes stored on the contract. If the counterparty tampered with a
 * hashable field (e.g. swapped their IBAN), the recomputed hash will be missing
 * from the stored set and this returns false.
 *
 * Note: only identifying fields are hashed (see `doNotHash` in hashPaymentData),
 * so changes to non-hashable fields (beneficiary, bic, name, ...) are not detected.
 *
 * Returns true ("nothing suspicious") when there is nothing to verify against
 * (no stored hashes, or no hashable fields), to avoid false positives.
 */
export const paymentDataMatchesHashes = (
  paymentData: PaymentData,
  storedHashes: string[],
): boolean => {
  // Genuinely nothing stored to verify against — don't false-positive.
  if (storedHashes.length === 0) return true;
  const computedHashes = hashPaymentData(paymentData).map((item) => item.hash);
  // No hashable fields in the decrypted data, so there is nothing to check.
  if (computedHashes.length === 0) return true;
  // Note: if the stored blob is non-empty but yields no valid hashes (malformed
  // or tampered), knownHashes is empty and every computed hash fails the check,
  // which correctly flags the data as suspicious.
  const knownHashes = extractHashes(storedHashes);
  return computedHashes.every((hash) => knownHashes.includes(hash));
};
