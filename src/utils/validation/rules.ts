import { validateMnemonic, wordlists } from 'bip39'
import { address } from 'bitcoinjs-lib'
import { getNetwork } from '../wallet/getNetwork'
import { addProtocol } from '../web/addProtocol'
import { isEmail } from './isEmail'

const MIN_PASSWORD_LENGTH = 8
export const rules = {
  required: (value: string) => !!value,
  email: isEmail,
  url: isURL,
  bitcoinAddress: isBitcoinAddress,
  blockTaprootAddress: (value: string) => !isTaproot(value),
  password: (value: string) => !!value && value.length >= MIN_PASSWORD_LENGTH,
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

function isURL (url: string) {
  try {
    return !!new URL(addProtocol(url.toLowerCase(), 'https'))
  } catch (e) {
    return false
  }
}

function isTaproot (value: string) {
  return /^(tb1p|bcrt1p|bc1p)/u.test(value)
}

function isReferralCode (code: string) {
  return code.length > 0 && /^[A-Z0-9]{1,16}$/u.test(code)
}

function isValidFeeRate (feeRate: string) {
  return /^[0-9.]*$/u.test(feeRate) && Number(feeRate) >= 1
}
