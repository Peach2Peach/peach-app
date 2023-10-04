import { validateMnemonic, wordlists } from 'bip39'
import { getNetwork } from '../wallet'
import { isAdvcashWallet } from './isAdvcashWallet'
import { isBIC } from './isBIC'
import { isBancolombiaAccountNumber } from './isBancolombiaAccountNumber'
import { isBitcoinAddress } from './isBitcoinAddress'
import { isCBU } from './isCBU'
import { isCVU } from './isCVU'
import { isCVUAlias } from './isCVUAlias'
import { isEUIBAN } from './isEUIBAN'
import { isEmail } from './isEmail'
import { isIBAN } from './isIBAN'
import { isNUBAN } from './isNUBAN'
import { isPaypalUsername } from './isPaypalUsername'
import { isPhone } from './isPhone'
import { isPhoneAllowed } from './isPhoneAllowed'
import { isReferralCode } from './isReferralCode'
import { isRevtag } from './isRevtag'
import { isTaproot } from './isTaproot'
import { isUKBankAccount } from './isUKBankAccount'
import { isUKSortCode } from './isUKSortCode'
import { isURL } from './isURL'
import { isUsername } from './isUsername'
import { isValidBitcoinSignature } from './isValidBitcoinSignature'
import { isValidDigitLength } from './isValidDigitLength'
import { isValidFeeRate } from './isValidFeeRate'
import { isValidPaymentReference } from './isValidPaymentReference'

export const rules = {
  required (required: boolean, value: string | number | null) {
    return !required || value
  },
  min (min: number, value: number) {
    return value >= min
  },
  max (max: number, value: number) {
    return value <= max
  },
  account (_: boolean, value: object) {
    return value && typeof value === 'object'
  },
  phone (_: boolean, value: string) {
    return isPhone(value)
  },
  email (_: boolean, value: string) {
    return isEmail(value)
  },
  url (_: boolean, value: string) {
    return isURL(value)
  },
  bitcoinAddress (_: boolean, value: string) {
    return isBitcoinAddress(value, getNetwork())
  },
  blockTaprootAddress (_: boolean, value: string) {
    return !isTaproot(value)
  },
  duplicate (existingValue: unknown) {
    return !existingValue
  },
  password (_: boolean, value: string) {
    return value && value.length > 7
  },
  referralCode (_: boolean, value: string) {
    return isReferralCode(value)
  },
  referralCodeTaken (isTaken: boolean) {
    return !isTaken
  },
  iban (_: boolean, value: string) {
    return isIBAN(value)
  },
  isNUBAN (_: boolean, value: string) {
    return isNUBAN(value)
  },
  isEUIBAN (_: boolean, value: string) {
    return isEUIBAN(value)
  },
  bic (_: boolean, value: string) {
    return isBIC(value)
  },
  isCBU (_: boolean, value: string) {
    return isCBU(value)
  },
  isCVU (_: boolean, value: string) {
    return isCVU(value)
  },
  isCVUAlias (_: boolean, value: string) {
    return isCVUAlias(value)
  },
  isBancolombiaAccountNumber (_: boolean, value: string) {
    return isBancolombiaAccountNumber(value)
  },
  userName (_: boolean, value: string) {
    return isUsername(value)
  },
  paypalUserName (_: boolean, value: string) {
    return isPaypalUsername(value)
  },
  revtag (_: boolean, value: string) {
    return isRevtag(value)
  },
  bip39 (_: boolean, value: string) {
    return validateMnemonic(value)
  },
  bip39Word (_: boolean, value: string) {
    return wordlists.english.includes(value)
  },
  signature ([btcAddress, message]: [string, string], value: string) {
    return isValidBitcoinSignature(message, btcAddress, value)
  },
  feeRate (_: boolean, value: string) {
    return isValidFeeRate(value)
  },
  isPhoneAllowed (_: boolean, value: string) {
    return isPhoneAllowed(value)
  },
  advcashWallet (_: boolean, value: string) {
    return isAdvcashWallet(value)
  },
  ukSortCode (_: boolean, value: string) {
    return isUKSortCode(value)
  },
  ukBankAccount (_: boolean, value: string) {
    return isUKBankAccount(value)
  },
  straksbetaling (_: boolean, value: string) {
    return isValidDigitLength(value, 11)
  },
  nationalTransferPL (_: boolean, value: string) {
    return isValidDigitLength(value, [26, 28])
  },
  nationalTransferCZ (_: boolean, value: string) {
    return isValidDigitLength(value, [10, 14])
  },
  nationalTransferDK (_: boolean, value: string) {
    return isValidDigitLength(value, 10)
  },
  nationalTransferHU (_: boolean, value: string) {
    return isValidDigitLength(value, 24)
  },
  nationalTransferNO (_: boolean, value: string) {
    return isValidDigitLength(value, 11)
  },
  nationalTransferBG (_: boolean, value: string) {
    return isValidDigitLength(value, 11)
  },
  nationalTransferRO (_: boolean, value: string) {
    return isValidDigitLength(value, 11)
  },
  isValidPaymentReference (_: boolean, value: string) {
    return isValidPaymentReference(value)
  },
}

export type Rule = keyof typeof rules
