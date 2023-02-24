import { validateMnemonic, wordlists } from 'bip39'
import { address } from 'bitcoinjs-lib'
import IBAN from 'iban'
import { getNetwork } from '../wallet'
import { isEUIBAN } from './isEUIBAN'
import { isPaypalUsername } from './isPaypalUsername'
import { isPhoneAllowed } from './isPhoneAllowed'
import { isTaproot } from './isTaproot'
import { isUsername } from './isUsername'
import { isValidBitcoinSignature } from './isValidBitcoinSignature'

const emailRegex
  = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u // eslint-disable-line prefer-named-capture-group, max-len
const urlRegex = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/u // eslint-disable-line prefer-named-capture-group, max-len

// eslint-disable-next-line prefer-named-capture-group
const bicRegex = /^[A-Z]{4}\s*[A-Z]{2}\s*[A-Z0-9]{2}\s*([A-Z0-9]{3})?$/u

export const rules = {
  required (required: boolean, value: string | number | null) {
    return !required || value
  },
  number: /^\d+$/u,
  min (min: number, value: number) {
    return value >= min
  },
  max (max: number, value: number) {
    return value <= max
  },
  account (_: boolean, value: object) {
    return value && typeof value === 'object'
  },
  phone: /^\+[1-9][0-9]{7,}$/u,
  email: emailRegex,
  url: urlRegex,
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
  iban (_: boolean, value: string | null) {
    if (!value) return false
    return IBAN.isValid(value)
  },
  isEUIBAN (_: boolean, value: string) {
    return isEUIBAN(value)
  },
  bic: bicRegex,
  userName (_: boolean, value: string) {
    return isUsername(value)
  },
  paypalUserName (_: boolean, value: string) {
    return isPaypalUsername(value)
  },
  revtag (_: boolean, value: string | null) {
    if (!value) return false
    return value !== '@' && /^@[a-z0-9]{3,16}$/u.test(value)
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
    return /^[uU][A-Za-z\d]{12}$/u.test(value.split(' ').join(''))
  },
  ukSortCode (_: boolean, value: string) {
    return /^\d{6}$/u.test(value)
  },
  ukBankAccount (_: boolean, value: string) {
    return /^\d{6,10}$/u.test(value)
  },
}

export type Rule = keyof typeof rules
