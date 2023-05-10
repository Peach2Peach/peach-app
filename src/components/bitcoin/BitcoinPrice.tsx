import { ReactElement } from 'react'
import { PriceFormat } from '../text'
import { SATSINBTC } from '../../constants'
import { useBitcoinPrices, useMarketPrices } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'

type PriceFormatProps = ComponentProps & {
  sats: number
}

export const BitcoinPrice = ({ sats, style }: PriceFormatProps): ReactElement => {
  const { displayPrice, displayCurrency } = useBitcoinPrices({ sats })
  return <PriceFormat amount={displayPrice} currency={displayCurrency} style={style} />
}
