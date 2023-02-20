import { verify } from 'bitcoinjs-message'

export const isValidBitcoinSignature = (message: string, btcAddress: string, signature: string) => {
  try {
    return verify(message, btcAddress, signature, undefined, true)
  } catch (e) {
    return false
  }
}
