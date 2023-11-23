import { validateMnemonic, wordlists } from 'bip39'
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
import i18n from '../i18n'
import { getNetwork } from '../wallet'
import { isAdvcashWallet } from './isAdvcashWallet'
import { isBIC } from './isBIC'
import { isBitcoinAddress } from './isBitcoinAddress'
import { isCBU } from './isCBU'
import { isCVU } from './isCVU'
import { isEUIBAN } from './isEUIBAN'
import { isEmail } from './isEmail'
import { isIBAN } from './isIBAN'
import { isPhone } from './isPhone'
import { isPhoneAllowed } from './isPhoneAllowed'
import { isReferralCode } from './isReferralCode'
import { isTaproot } from './isTaproot'
import { isUKBankAccount } from './isUKBankAccount'
import { isUKSortCode } from './isUKSortCode'
import { isURL } from './isURL'
import { isUsername } from './isUsername'
import { isValidDigitLength } from './isValidDigitLength'
import { isValidFeeRate } from './isValidFeeRate'
import { isValidPaymentReference } from './isValidPaymentReference'
import { getMessages } from './messages'

export const rules = {
  required: (value: string) => !!value,
  email: isEmail,
  url: isURL,
  bitcoinAddress: (value: string) => isBitcoinAddress(value, getNetwork()),
  blockTaprootAddress: (value: string) => !isTaproot(value),
  password: (value: string) => !!value && value.length > 7,
  referralCode: isReferralCode,
  bip39: validateMnemonic,
  bip39Word: (value: string) => wordlists.english.includes(value),
  feeRate: isValidFeeRate,
}

export type Rule = keyof typeof rules

const ibanValidator = (value: string) => isIBAN(value) || getMessages().iban
const isEUIBANValidator = (value: string) => isEUIBAN(value) || getMessages().isEUIBAN
const bicValidator = (value: string) => isBIC(value) || getMessages().bic
const referenceValidator = (value: string) => isValidPaymentReference(value) || getMessages().isValidPaymentReference
const advcashWalletValidator = (value: string) => isAdvcashWallet(value) || getMessages().advcashWallet
const emailValidator = (value: string) => isEmail(value) || getMessages().email
const phoneValidator = (value: string) => isPhone(value) || getMessages().phone
const ukBankAccountValidator = (value: string) => isUKBankAccount(value) || getMessages().ukBankAccount
const ukSortCodeValidator = (value: string) => isUKSortCode(value) || getMessages().ukSortCode
const userNameValidator = (value: string) => isUsername(value) || getMessages().userName
const isPhoneAllowedValidator = (value: string) => isPhoneAllowed(value) || getMessages().isPhoneAllowed
const accountNumberValidator = (value: string) => isValidDigitLength(value, [10, 28]) || i18n('form.account.errors')
const cbuValidator = (value: string) => isCBU(value) || getMessages().isCBU
const cvuValidator = (value: string) => isCVU(value) || getMessages().isCVU

export const newRules = {
  beneficiary: {},
  iban: {
    iban: ibanValidator,
    isEUIBAN: isEUIBANValidator,
  },
  bic: {
    bic: bicValidator,
  },
  reference: {
    isValidPaymentReference: referenceValidator,
  },
  wallet: {
    advcashWallet: advcashWalletValidator,
  },
  email: {
    email: emailValidator,
  },
  phone: {
    phone: phoneValidator,
    isPhoneAllowed: isPhoneAllowedValidator,
  },
  ukBankAccount: {
    ukBankAccount: ukBankAccountValidator,
  },
  ukSortCode: {
    ukSortCode: ukSortCodeValidator,
  },
  userName: {
    userName: userNameValidator,
  },
  accountNumber: {
    accountNumber: accountNumberValidator,
  },
  lnurlAddress: {
    lnurlAddress: emailValidator,
  },
  cbu: {
    isCBU: cbuValidator,
  },
  cvu: {
    isCVU: cvuValidator,
  },
  cvuAlias: {
    isCVUAlias: cvuValidator,
  },
  chipperTag: {
    userName: userNameValidator,
  },
}

export type PaymentFieldTypes = keyof typeof newRules

export const getNewRules = (fieldName: PaymentFieldTypes, optional = false) => {
  const rulesForField = newRules[fieldName]
  if (!optional) return rulesForField

  const rulesWithEmptyCheck = Object.entries(rulesForField).reduce(
    (acc, [ruleName, ruleFunction]) => ({
      ...acc,
      [ruleName]: (value: string) => {
        if (!value) return true
        return ruleFunction(value)
      },
    }),
    {},
  )
  return rulesWithEmptyCheck
}

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
