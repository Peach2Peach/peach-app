import IBAN from "iban";

export const enforceIBANFormat = (iban: string) => IBAN.printFormat(iban);
