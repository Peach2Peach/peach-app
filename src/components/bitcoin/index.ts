import { createContext } from 'react'
import { marketPrice } from '../../utils/peachAPI'

export type BitcoinContextType = {
  currency: Currency,
  price: number,
  satsPerUnit: number
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


export const updateBitcoinContext = async (currency: Currency): Promise<BitcoinContextType> => {
  let price = bitcoinContext.price
  let satsPerUnit = bitcoinContext.satsPerUnit

  const [pairInfo, error] = await marketPrice(currency)

  if (error?.error) {
    return bitcoinContext
  }

  price = Number(pairInfo.price)
  satsPerUnit = Math.round(100000000 / price)
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