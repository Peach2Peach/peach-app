import { Linking } from 'react-native'

/**
 * @description Method to open payment request in wallet
 * @param paymentRequest bitcoin payment request (e.g bitcoin:<ADDRESS>?amount=0.0005&message=Peach+Escrow+-+offer+P7A)
 */
export const openInWallet = async (paymentRequest: string) => {
  try {
    await Linking.openURL(paymentRequest)
    return true
  } catch (e) {}
  return false
}