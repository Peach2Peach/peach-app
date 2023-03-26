import { ReactElement } from 'react';
import { PriceFormat } from '../text'
import { SATSINBTC } from '../../constants'
import { useMarketPrices } from '../../hooks'
import { account } from '../../utils/account'

type PriceFormatProps = ComponentProps & {
  sats: number
}

export const BitcoinPrice = ({ sats, style }: PriceFormatProps): ReactElement => {
  const { data: marketPrices } = useMarketPrices()

  const { displayCurrency } = account.settings
  const marketPrice = (marketPrices && marketPrices[displayCurrency]) || 0
  const price = (marketPrice / SATSINBTC) * sats
  return <PriceFormat amount={price} currency={displayCurrency} style={style} />
}

export default BitcoinPrice
