import IBAN from "iban";

export const sepaMembers = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GI",
  "GR",
  "HU",
  "IS",
  "IE",
  "IT",
  "LV",
  "LI",
  "LT",
  "LU",
  "MT",
  "MC",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SM",
  "SK",
  "SI",
  "ES",
  "SE",
  "CH",
  "GB",
];
export const isEUIBAN = (iban: string) =>
  IBAN.isValid(iban) && sepaMembers.includes(iban.substring(0, 2));
