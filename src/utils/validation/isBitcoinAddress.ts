import { Network, address } from 'bitcoinjs-lib'

export const isBitcoinAddress = (value: string, network: Network) => {
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
