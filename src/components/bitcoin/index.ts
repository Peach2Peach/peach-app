import { createContext } from 'react'
import { HTTP_AUTH_USER, HTTP_AUTH_PASS } from '@env'

type currency = 'EUR' | 'CHF' | 'GBP'

export type BitcoinContextType = {
  currency: currency,
  price: number,
  satsPerUnit: number
}

type TradingPair = 'BTCEUR' | 'BTCCHF' | 'BTCGBP'

export type PeachPairInfo = {
  pair: TradingPair,
  price: number,
}

export let bitcoinContext: BitcoinContextType = {
  currency: 'EUR',
  price: NaN,
  satsPerUnit: NaN
}

export const getBitcoinContext = (): BitcoinContextType => bitcoinContext

/**
 * @description Context for bitcoin
 * @example
 * import BitcoinContext from './components/inputs/LanguageSelect'
 *
 * export default (): ReactElement =>
 *   const { locale } = useContext(LanguageContext)
 *   return <Text>
 *     {locale}
 *   </Text>
 * }
 */
export const BitcoinContext = createContext(bitcoinContext)


export const updateBitcoinContext = async (currency: currency): Promise<BitcoinContextType> => {
  let price = bitcoinContext.price
  let satsPerUnit = bitcoinContext.satsPerUnit

  const response = await fetch(`http://192.168.1.62:8080/market/price/BTC${currency}`, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${HTTP_AUTH_USER}:${HTTP_AUTH_PASS}`).toString('base64')
    }
  })

  try {
    const result = await response.json() as PeachPairInfo
    price = Number(result.price)
    satsPerUnit = Math.round(100000000 / price)
  } catch {}

  // eslint-disable-next-line require-atomic-updates
  bitcoinContext = {
    currency,
    price,
    satsPerUnit
  }

  return bitcoinContext
}

export { BitcoinAddress } from './BitcoinAddress'

export default BitcoinContext