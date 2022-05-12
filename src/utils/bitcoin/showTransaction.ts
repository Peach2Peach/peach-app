import { Linking } from 'react-native'

/**
 * @description Method to open transaction in block explorer
 * @param txId the bitcoin request
 */
export const showTransaction = (txId: string, network: BitcoinNetwork) =>
  network === 'bitcoin'
    ? Linking.openURL(`https://mempool.space/tx/${txId}`)
    : Linking.openURL(`https://mempool.space/testnet/tx/${txId}`)