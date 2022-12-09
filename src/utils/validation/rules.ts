import { wordlists } from 'bip39'
import { address } from 'bitcoinjs-lib'
import IBAN from 'iban'
import { getNetwork } from '../wallet'

const emailRegex
  = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u // eslint-disable-line prefer-named-capture-group, max-len
// eslint-disable-next-line prefer-named-capture-group
const bicRegex = /^[A-Z]{4}\s*[A-Z]{2}\s*[A-Z0-9]{2}\s*([A-Z0-9]{3})?$/u

export const rules = {
  required (required: boolean, value: string | number | null) {
    return !required || value
  },
  number: /^\d+$/u,
  account (_: boolean, value: object) {
    return value && typeof value === 'object'
  },
  phone: /^\+[1-9][0-9]{7,}$/u,
  email: emailRegex,
  bitcoinAddress (_: boolean, value: string) {
    let valid = false
    try {
      address.toOutputScript(value, getNetwork())
      valid = true
    } catch (e) {}

    return valid
  },
  duplicate (existingValue: any) {
    return !existingValue
  },
  password (_: boolean, value: string) {
    return value && value.length > 7
  },
  referralCode (_: boolean, value: string) {
    return !value || value.length === 0 || /^PR[0-9A-F]{4,}$/u.test(value)
  },
  iban (_: boolean, value: string | null) {
    if (!value) return false
    return IBAN.isValid(value)
  },
  bic: bicRegex,
  ukSortCode: /^(?!(?:0{6}|00-00-00))(?:\d{6}|\d\d-\d\d-\d\d)$/u,
  ukBankAccount: /^\d{8}$/u,
  userName (_: boolean, value: string | null) {
    if (!value) return false
    return value !== '@' && /^@[a-z0-9]*/iu.test(value)
  },
  url (_: boolean, value: string) {
    if (!value) return false
    try {
      const link = /http/u.test(value) ? value : `http://${value}`
      const url = new URL(link)
      return !!url
    } catch (e) {
      return false
    }
  },
  bip39 (_: boolean, value: string) {
    return wordlists.english.includes(value)
  },
}

export type Rule = keyof typeof rules
