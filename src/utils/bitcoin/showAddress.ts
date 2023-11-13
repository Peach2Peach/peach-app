import { ESPLORA_URL } from '@env'
import { openURL } from '../web/openURL'

export const showAddress = (address: string, network: BitcoinNetwork) => {
  let link = `https://mempool.space/address/${address}`

  if (network === 'testnet') link = `https://mempool.space/testnet/address/${address}`
  if (network === 'regtest') link = `${ESPLORA_URL}/address/${address}`
  return openURL(link)
}
