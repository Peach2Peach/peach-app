import IBAN from "iban";

export const isIBAN = (iban?: string) => !!iban && IBAN.isValid(iban);
