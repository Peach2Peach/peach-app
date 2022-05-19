import * as bitcoin from 'bitcoinjs-lib'
import IBAN from 'iban'
import { PAYMENTMETHODINFOS } from '../constants'
import i18n from './i18n'

/**
 * @description Method to check whether MoP supports given currency
 * @param paymentMethod id of MoP
 * @param currencies currencies
 * @returns true if payment method supports  selected currency
 */
export const paymentMethodAllowedForCurrency = (paymentMethod: PaymentMethod, currency: Currency) => {
  const paymentMethodInfo = PAYMENTMETHODINFOS.find(info => info.id === paymentMethod)
  return paymentMethodInfo?.currencies.some(c => currency === c)
}


/**
 * @description Method to check whether MoP supports at least one of the given currencies
 * @param paymentMethod id of MoP
 * @param currencies currencies
 * @returns true if payment method supports at least one of the selected currencies
 */
 export const paymentMethodAllowedForCurrencies = (paymentMethod: PaymentMethod, currencies: Currency[]) => {
  const paymentMethodInfo = PAYMENTMETHODINFOS.find(info => info.id === paymentMethod)
  return paymentMethodInfo?.currencies.some(c => currencies.indexOf(c) !== -1)
}

/**
 * @description Method to check whether another MoP of the same type has not been selected
 * @param paymentData MoP in question
 * @param allPaymentData all MoPs of account
 * @returns true if no other MoP of the same type has been selected
 */
export const paymentMethodNotYetSelected = (paymentData: PaymentData, allPaymentData: PaymentData[]) => {
  const sameTypeMoPs = allPaymentData.filter(p => p.type === paymentData.type && p.id !== paymentData.id)
  return !sameTypeMoPs.some(p => p.selected)
}

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
  password (_: boolean, value: string) {
    return value && value.length > 7
  },
  iban (_: boolean, value: string | null) {
    if (!value) return false
    return IBAN.isValid(value)
  },
  paypal (_: boolean, value: string | null) {
    if (!value) return false
    return emailRegex.test(value) || /^@[a-z0-9]*/iu.test(value)
  }
}

export const getMessages = () => ({
  default: {
    required: i18n('form.required.error'),
    password: i18n('form.password.error'),
    bitcoinAddress: i18n('form.btcAddress.error'),
    iban: i18n('form.invalid.error'),
    account: i18n('form.account.error'),
    email: i18n('form.email.error')
  }
})