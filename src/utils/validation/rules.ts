import { isValidDigitLength } from './isValidDigitLength'
import { validateMnemonic, wordlists } from 'bip39'
import { address } from 'bitcoinjs-lib'
import { getNetwork } from '../wallet'
import { isAdvcashWallet } from './isAdvcashWallet'
import { isBIC } from './isBIC'
import { isEmail } from './isEmail'
import { isEUIBAN } from './isEUIBAN'
import { isIBAN } from './isIBAN'
import { isPaypalUsername } from './isPaypalUsername'
import { isPhone } from './isPhone'
import { isPhoneAllowed } from './isPhoneAllowed'
import { isRevtag } from './isRevtag'
import { isTaproot } from './isTaproot'
import { isUKBankAccount } from './isUKBankAccount'
import { isUKSortCode } from './isUKSortCode'
import { isURL } from './isURL'
import { isUsername } from './isUsername'
import { isValidBitcoinSignature } from './isValidBitcoinSignature'

export const rules = {
  required (required: boolean, value: string | number | null) {
    return !required || value
  },
  requiredShort (required: boolean, value: string | number | null) {
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
    let valid = false
    try {
      address.toOutputScript(value, getNetwork())
      valid = true
    } catch (e) {}

    return valid
  },
  blockTaprootAddress (_: boolean, value: string) {
    return !isTaproot(value)
  },
  duplicate (existingValue: any) {
    return !existingValue
  },
  password (_: boolean, value: string) {
    return value && value.length > 7
  },
  referralCode (_: boolean, value: string) {
    return !value || value.length === 0 || /^[A-Z0-9]{4,16}$/u.test(value)
  },
  iban (_: boolean, value: string) {
    return isIBAN(value)
  },
  isEUIBAN (_: boolean, value: string) {
    return isEUIBAN(value)
  },
  bic (_: boolean, value: string) {
    return isBIC(value)
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
    return /^[0-9]*$/u.test(value) && Number(value) >= 1
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
}

export type Rule = keyof typeof rules
