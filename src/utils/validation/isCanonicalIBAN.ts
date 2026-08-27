// an IBAN is at most 34 characters: 2 country letters, 2 check digits and a
// BBAN of up to 30 uppercase alphanumerics (the shortest registered one, NO,
// is 15). Deliberately no country table: any two-letter country code is
// accepted, so IBANs from countries added to the registry later still work.
const CANONICAL_IBAN = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/u;

const LETTER = /[A-Z]/u;
// ISO 13616 maps A..Z onto 10..35, so 'A'.charCodeAt(0) - 55 === 10
const LETTER_TO_DIGITS_OFFSET = 55;
const COUNTRY_AND_CHECK_DIGITS_LENGTH = 4;
const MODULUS = 97;
const VALID_REMAINDER = 1;
const DECIMAL_BASE = 10;

const toDigits = (iban: string) =>
  [...iban]
    .map((character) =>
      LETTER.test(character)
        ? String(character.charCodeAt(0) - LETTER_TO_DIGITS_OFFSET)
        : character,
    )
    .join("");

/**
 * ISO 7064 MOD 97-10, computed digit by digit because the rearranged IBAN is
 * far too large for a JS number.
 */
const mod97 = (digits: string) =>
  [...digits].reduce(
    (remainder, digit) => (remainder * DECIMAL_BASE + Number(digit)) % MODULUS,
    0,
  );

/**
 * Whether an IBAN is exactly in the form this app stores and publishes:
 * uppercase, no whitespace, no dashes or any other separator, and with valid
 * check digits. Anything that would first have to be cleaned up is rejected -
 * run it through `normalizeIBAN` first if that is what you want.
 */
export const isCanonicalIBAN = (iban: string) => {
  if (!CANONICAL_IBAN.test(iban)) return false;
  const rearranged =
    iban.slice(COUNTRY_AND_CHECK_DIGITS_LENGTH) +
    iban.slice(0, COUNTRY_AND_CHECK_DIGITS_LENGTH);
  return mod97(toDigits(rearranged)) === VALID_REMAINDER;
};
