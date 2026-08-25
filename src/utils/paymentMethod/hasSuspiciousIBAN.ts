import { normalizeIBAN } from "../format/normalizeIBAN";
import { isCanonicalIBAN } from "../validation/isCanonicalIBAN";

/**
 * Payment data published by this app always carries an IBAN in its canonical
 * form (uppercase, no separators) with valid check digits. If a counterparty's
 * decrypted payment data does not, the details did not come out of the regular
 * flow - either they were tampered with after the hashes were published, or
 * they are meant to look like an IBAN that they are not.
 *
 * The two checks are orthogonal: hashing normalizes before hashing, so a
 * separator-laden IBAN still matches its published hash and only the canonical
 * form comparison catches it.
 */
export const hasSuspiciousIBAN = (
  paymentData: PaymentDataInfo | PaymentData,
) => {
  const { iban } = paymentData;
  if (!iban) return false;
  return iban !== normalizeIBAN(iban) || !isCanonicalIBAN(iban);
};
