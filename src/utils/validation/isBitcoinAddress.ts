import { address } from 'bitcoinjs-lib'
import { getNetwork } from '../wallet'

export const isBitcoinAddress = (value: string) => {
  let valid = false
  try {
    address.toOutputScript(value, getNetwork())
    valid = true
  } catch (e) {}

  return valid
}
