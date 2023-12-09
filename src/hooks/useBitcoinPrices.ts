import { SATSINBTC } from '../constants'
import { useSettingsStore } from '../store/settingsStore'
import { round } from '../utils/math'
import { useMarketPrices } from './query/useMarketPrices'

export const useBitcoinPrices = (sats = 0) => {
  const { data: prices } = useMarketPrices()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)
  const bitcoinPrice = prices?.[displayCurrency] ?? 0
  const moscowTime = Math.round(SATSINBTC / bitcoinPrice)
  const fiatPrice = round((bitcoinPrice / SATSINBTC) * sats, 2)

  return {
    bitcoinPrice,
    moscowTime,
    displayCurrency,
    fiatPrice,
  }
}
