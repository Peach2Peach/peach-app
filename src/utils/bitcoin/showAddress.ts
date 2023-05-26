import { BLOCKEXPLORER } from '@env'
import { Linking } from 'react-native'

export const showAddress = (address: string, network: BitcoinNetwork) => {
  let link = `https://mempool.space/address/${address}`

  if (network === 'testnet') link = `https://mempool.space/testnet/address/${address}`
  if (network === 'regtest') link = `${BLOCKEXPLORER}/address/${address}`
  Linking.openURL(link)
}
