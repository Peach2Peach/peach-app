import { validateMnemonic, wordlists } from 'bip39'
import { address } from 'bitcoinjs-lib'
import { getNetwork } from '../wallet'
import { isEmail } from './isEmail'
import { isReferralCode } from './isReferralCode'
import { isTaproot } from './isTaproot'
import { isURL } from './isURL'
import { isValidFeeRate } from './isValidFeeRate'

export const rules = {
  required: (value: string) => !!value,
  email: isEmail,
  url: isURL,
  bitcoinAddress: isBitcoinAddress,
  blockTaprootAddress: (value: string) => !isTaproot(value),
  password: (value: string) => !!value && value.length > 7,
  referralCode: isReferralCode,
  bip39: validateMnemonic,
  bip39Word: (value: string) => wordlists.english.includes(value),
  feeRate: isValidFeeRate,
}

export type Rule = keyof typeof rules

function isBitcoinAddress (value: string) {
  const network = getNetwork()
  try {
    const result = address.fromBech32(value)
    return result.prefix === network.bech32
  } catch (e) {
    try {
      address.toOutputScript(value, network)
      return true
    } catch (e2) {
      return false
    }
  }
}
