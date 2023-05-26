import { PriceFormat } from '../text'
import { useBitcoinPrices } from '../../hooks'

type PriceFormatProps = ComponentProps & {
  sats: number
}

export const BitcoinPrice = ({ sats, style }: PriceFormatProps) => {
  const { displayPrice, displayCurrency } = useBitcoinPrices({ sats })
  return <PriceFormat amount={displayPrice} currency={displayCurrency} style={style} />
}
