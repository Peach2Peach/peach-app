import { z } from "zod";
import { enforceBICFormat } from "../format/enforceBICFormat";
import { enforceIBANFormat } from "../format/enforceIBANFormat";
import { enforcePhoneFormat } from "../format/enforcePhoneFormat";
import { enforceUsernameFormat } from "../format/enforceUsernameFormat";
import { enforceWalletFormat } from "../format/enforceWalletFormat";
import { removeNonDigits } from "../format/removeNonDigits";

export const Formatter = z.enum([
  "bic",
  "cbu",
  "cvu",
  "cvuAlias",
  "iban",
  "phone",
  "ukBankAccount",
  "ukSortCode",
  "userName",
  "wallet",
]);

export const formatters: Record<
  z.infer<typeof Formatter>,
  (val: string) => string
> = {
  bic: enforceBICFormat,
  cbu: removeNonDigits,
  cvu: removeNonDigits,
  cvuAlias: removeNonDigits,
  iban: enforceIBANFormat,
  phone: enforcePhoneFormat,
  ukBankAccount: removeNonDigits,
  ukSortCode: removeNonDigits,
  userName: enforceUsernameFormat,
  wallet: enforceWalletFormat,
};
