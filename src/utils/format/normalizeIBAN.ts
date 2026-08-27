// IBANs are ASCII alphanumeric, so everything else is a separator: spaces (the
// input field groups by four while typing), non-breaking spaces from pasted
// text, dashes, dots.
const SEPARATORS = /[^A-Za-z0-9]/gu;

/**
 * The canonical form an IBAN is stored, hashed and published in:
 * separator-free and uppercase.
 *
 * Since the hash of an IBAN is its identity across users and devices, the same
 * account number must always produce the same string - so normalize at every
 * point where payment data is saved or published.
 */
export const normalizeIBAN = (iban: string) =>
  iban.replace(SEPARATORS, "").toUpperCase();
