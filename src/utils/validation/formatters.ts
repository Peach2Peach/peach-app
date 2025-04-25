import { z } from "zod";
import { enforceBICFormat } from "../format/enforceBICFormat";
import { enforceBankNumberFormat } from "../format/enforceBankNumberFormat";
import { enforceIBANFormat } from "../format/enforceIBANFormat";
import { enforcePhoneFormat } from "../format/enforcePhoneFormat";
import { enforceSortCodeFormat } from "../format/enforceSortCodeFormat";
import { enforceUsernameFormat } from "../format/enforceUsernameFormat";
import { enforceWalletFormat } from "../format/enforceWalletFormat";

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
  cbu: enforceBankNumberFormat,
  cvu: enforceBankNumberFormat,
  cvuAlias: enforceBankNumberFormat,
  iban: enforceIBANFormat,
  phone: enforcePhoneFormat,
  ukBankAccount: enforceBankNumberFormat,
  ukSortCode: enforceSortCodeFormat,
  userName: enforceUsernameFormat,
  wallet: enforceWalletFormat,
};
