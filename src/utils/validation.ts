import * as bitcoin from 'bitcoinjs-lib'
import IBAN from 'iban'
import i18n from './i18n'

// eslint-disable-next-line prefer-named-capture-group, max-len
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u
// eslint-disable-next-line prefer-named-capture-group, max-len
const bicRegex = /([a-zA-Z]{4})([a-zA-Z]{2})(([2-9a-zA-Z]{1})([0-9a-np-zA-NP-Z]{1}))((([0-9a-wy-zA-WY-Z]{1})([0-9a-zA-Z]{2}))|([xX]{3})|)/u

export const rules = {
  required (required: boolean, value: string | number | null) {
    return !required || value
  },
  number: /^\d+$/u,
  account (_: boolean, value: object) {
    return value && typeof value === 'object'
  },
  phone: /^[0-9-.()+ ]+$/u,
  email: emailRegex,
  bitcoinAddress (_: boolean, value: string) {
    let valid = false
    try {
      bitcoin.address.fromBase58Check(value)
      valid = true
    } catch (e) { }
    try {
      bitcoin.address.fromBech32(value)
      valid = true
    } catch (e) { }

    return valid
  },
  tetherAddress (_: boolean, value: string) {
    if (!value) return false

    // Tether as erc-20 token
    if (/0x+[A-F,a-f,0-9]{40}/u.test(value)) return true

    // Tether as trc-20 token
    if (/T[A-Za-z1-9]{33}/u.test(value)) return true

    // tether on omni layer
    let valid = false
    try {
      bitcoin.address.fromBase58Check(value)
      valid = true
    } catch (e) { }
    return valid
  },
  duplicate (existingValue: any) {
    return !existingValue
  },
  password (_: boolean, value: string) {
    return value && value.length > 7
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
    return /^@[a-z0-9]*/iu.test(value)
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
  }
}

export const getMessages = () => ({
  default: {
    required: i18n('form.required.error'),
    number: i18n('form.invalid.error'),
    phone: i18n('form.invalid.error'),
    email: i18n('form.email.error'),
    account: i18n('form.account.error'),
    password: i18n('form.password.error'),
    bitcoinAddress: i18n('form.address.error'),
    tetherAddress: i18n('form.address.error'),
    duplicate: i18n('form.duplicate.error'),
    iban: i18n('form.invalid.error'),
    bic: i18n('form.invalid.error'),
    ukSortCode: i18n('form.invalid.error'),
    ukBankAccount: i18n('form.invalid.error'),
    userName: i18n('form.invalid.error'),
    url: i18n('form.invalid.error'),
  }
})