import * as bitcoin from 'bitcoinjs-lib'
import IBAN from 'iban'
import i18n from './i18n'

// eslint-disable-next-line prefer-named-capture-group, max-len
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u

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
  duplicate (existingValue: any) {
    console.log(existingValue)
    return !existingValue
  },
  password (_: boolean, value: string) {
    return value && value.length > 7
  },
  iban (_: boolean, value: string | null) {
    if (!value) return false
    return IBAN.isValid(value)
  },
  userName (_: boolean, value: string | null) {
    if (!value) return false
    return emailRegex.test(value) || /^@[a-z0-9]*/iu.test(value)
  }
}

export const getMessages = () => ({
  default: {
    required: i18n('form.required.error'),
    password: i18n('form.password.error'),
    bitcoinAddress: i18n('form.btcAddress.error'),
    duplicate: i18n('form.duplicate.error'),
    iban: i18n('form.invalid.error'),
    account: i18n('form.account.error'),
    email: i18n('form.email.error'),
    userName: i18n('form.invalid.error'),
  }
})