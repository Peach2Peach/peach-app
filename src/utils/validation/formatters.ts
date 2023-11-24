import { z } from 'zod'
import {
  enforceBICFormat,
  enforceBankNumberFormat,
  enforceIBANFormat,
  enforcePhoneFormat,
  enforceSortCodeFormat,
  enforceUsernameFormat,
} from '../format'
import { enforceWalletFormat } from '../format/enforceWalletFormat'

export const Formatter = z.enum([
  'bic',
  'cbu',
  'cvu',
  'cvuAlias',
  'iban',
  'phone',
  'ukBankAccount',
  'ukSortCode',
  'userName',
  'wallet',
])

export const formatters: Record<z.infer<typeof Formatter>, (val: string) => string> = {
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
}
