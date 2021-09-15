import * as bitcoin from 'bitcoinjs-lib'
import i18n from './i18n'

export const rules = {
  required (required: boolean, value: string) {
    return required ? value.length > 0 : true
  },
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
  }
}

export const getMessages = () => ({
  default: {
    required: i18n('form.required.error'),
    bitcoinAddress: i18n('form.btcAddress.error')
  }
})