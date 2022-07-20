import { Linking } from 'react-native'

/**
 * @description Method to open payment request in wallet
 * @param paymentRequest bitcoin payment request (e.g bitcoin:<ADDRESS>?amount=0.0005&message=Peach+Escrow+-+offer+P7A)
 */
export const openInWallet = async (paymentRequest: string) => {
  const wallets = [
    'bitcoin',
    'bluewallet',
    'muun',
    'walletofsatoshi',
  ]
  if (await Linking.canOpenURL(paymentRequest)) {
    await Linking.openURL(paymentRequest)
    return true
  }

  while (wallets.length > 0) {
    const wallet = wallets.shift()
    // eslint-disable-next-line no-await-in-loop
    if (await Linking.canOpenURL(`${wallet}://${paymentRequest}`)) {
      // eslint-disable-next-line no-await-in-loop
      await Linking.openURL(`${wallet}://${paymentRequest}`)
      return true
    }
  }

  return false
}