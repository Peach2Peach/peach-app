import { Linking } from 'react-native'

/**
 * @description Method to open address in block explorer
 * @param address the bitcoin address
 */
export const showAddress = (address: string, network: BitcoinNetwork) =>
  network === 'bitcoin'
    ? Linking.openURL(`https://mempool.space/address/${address}`)
    : Linking.openURL(`https://mempool.space/testnet/address/${address}`)