import { BLOCKEXPLORER } from '@env'
import { Linking } from 'react-native'

export const showTransaction = (txId: string, network: BitcoinNetwork) => {
  let link = `https://mempool.space/tx/${txId}`

  if (network === 'testnet') link = `https://mempool.space/testnet/tx/${txId}`
  if (network === 'regtest') link = `${BLOCKEXPLORER}/tx/${txId}`

  Linking.openURL(link)
}
