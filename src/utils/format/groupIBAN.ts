import { isCanonicalIBAN } from "../validation/isCanonicalIBAN";

// every four characters, unless they are the last ones
const EVERY_FOUR_CHARACTERS = /(.{4})(?!$)/gu;

/**
 * Groups an IBAN into blocks of four for readability. Display only - the stored
 * and published value stays canonical.
 *
 * An IBAN that is not canonical (it carries whitespace or dashes, or its check
 * digits do not add up) is returned untouched: those are exactly the ones the
 * suspicious payment details banner warns about, and tidying them up would hide
 * what was actually received.
 */
export const groupIBAN = (iban: string) =>
  isCanonicalIBAN(iban) ? iban.replace(EVERY_FOUR_CHARACTERS, "$1 ") : iban;
