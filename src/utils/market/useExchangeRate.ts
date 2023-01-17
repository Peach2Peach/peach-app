import { useMarketPrices } from '../../hooks'

export const useExchangeRate = (currency1: Currency, currency2: Currency) => {
  const { data: marketPrices } = useMarketPrices()
  if (!marketPrices) return 1

  const price1 = marketPrices[currency1]
  const price2 = marketPrices[currency2]
  if (!price1 || !price2) return 1

  return price1 / price2
}
