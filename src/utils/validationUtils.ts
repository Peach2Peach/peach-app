import * as bitcoin from 'bitcoinjs-lib'
import IBAN from 'iban'
import i18n from './i18n'

export const rules = {
  required (required: boolean, value: string | number) {
    return !required || value
  },
  number: /^\d+$/u,
  account (_: boolean, value: object) {
    return value && typeof value === 'object'
  },
  phone: /^[0-9-.()+ ]+$/u,
  // eslint-disable-next-line prefer-named-capture-group, max-len
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u,
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
  iban (_: boolean, value: string) {
    return IBAN.isValid(value)
  }
}

export const getMessages = () => ({
  default: {
    required: i18n('form.required.error'),
    password: i18n('form.password.error'),
    bitcoinAddress: i18n('form.btcAddress.error'),
    iban: i18n('form.invalid.error'),
    account: i18n('form.account.error'),
  }
})