import { createContext, Dispatch, ReducerState } from 'react'
import { SATSINBTC } from '../constants'

let currency: Currency = 'EUR'
let price = NaN
let satsPerUnit = NaN
let prices: Pricebook = {}

export const setDisplayCurrencyQuiet = (c: Currency) => currency = c
export const getBitcoinContext = (): BitcoinState => ({
  currency,
  price,
  satsPerUnit,
  prices,
})

const dispatch: Dispatch<Partial<BitcoinState>> = () => {}

/**
 * @description Context for bitcoin
 * @example
 * import BitcoinContext from './components/contexts/bitcoin'
 *
 * export default (): ReactElement =>
 *   const [{ currency }] = useContext(BitcoinContext)
 *   return <Text>
 *     {locale}
 *   </Text>
 * }
 */
export const setBitcoinContext = (state: ReducerState<any>, newState: Partial<BitcoinState>): BitcoinState => {
  if (newState.prices) prices = newState.prices
  if (newState.currency) currency = newState.currency

  price = prices[currency] || price
  satsPerUnit = Math.round(SATSINBTC / price)

  return {
    currency,
    price,
    satsPerUnit,
    prices,
  }
}

export const BitcoinContext = createContext([
  getBitcoinContext(),
  dispatch
] as const)

export default BitcoinContext