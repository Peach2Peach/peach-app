import { address } from 'bitcoinjs-lib'

export const isBitcoinAddress = (value: string) => {
  let valid = false
  try {
    address.fromBech32(value)
    valid = true
  } catch (e) {
    try {
      address.fromBase58Check(value)
      valid = true
    } catch (e2) {}
  }

  return valid
}
