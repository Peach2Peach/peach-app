import { Linking } from 'react-native'
import { error } from '../log/error'

export const openInWallet = async (paymentRequest: string) => {
  try {
    await Linking.openURL(paymentRequest)
    return true
  } catch (e) {
    error(e)
  }
  return false
}
