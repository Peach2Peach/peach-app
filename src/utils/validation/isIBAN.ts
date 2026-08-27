import { normalizeIBAN } from "../format/normalizeIBAN";
import { isCanonicalIBAN } from "./isCanonicalIBAN";

/**
 * Accepts an IBAN in any of the shapes a user may enter or paste it in - the
 * input field itself formats it into groups of four while typing - by
 * normalizing before validating. Payment data is stored normalized, so what
 * passes here is what ends up being saved.
 */
export const isIBAN = (iban?: string) =>
  !!iban && isCanonicalIBAN(normalizeIBAN(iban));
