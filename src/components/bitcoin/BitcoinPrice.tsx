import { ReactElement } from 'react'
import { PriceFormat } from '../text'
import { SATSINBTC } from '../../constants'
import { useMarketPrices } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'

type PriceFormatProps = ComponentProps & {
  sats: number
}

export const BitcoinPrice = ({ sats, style }: PriceFormatProps): ReactElement => {
  const { data: marketPrices } = useMarketPrices()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)

  const marketPrice = (marketPrices && marketPrices[displayCurrency]) || 0
  const price = (marketPrice / SATSINBTC) * sats
  return <PriceFormat amount={price} currency={displayCurrency} style={style} />
}
