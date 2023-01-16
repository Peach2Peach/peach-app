import { useQuery } from '@tanstack/react-query'
import { useMarketPrices } from '../../../hooks'
import { account } from '../../../utils/account'
import { defaultLimits } from '../../../utils/account/account'
import { getTradingLimit } from '../../../utils/peachAPI'

const tradingLimitQuery = async () => {
  const [result, err] = await getTradingLimit({})
  if (err) {
    throw new Error(err.error)
  }
  return result
}
export const useTradingLimits = () => {
  const { data: limits } = useQuery(['tradingLimits'], tradingLimitQuery)
  const { data: marketPrices } = useMarketPrices()

  const { displayCurrency } = account.settings
  const displayPrice = marketPrices && marketPrices[displayCurrency]
  const exchangeRate = displayPrice && marketPrices.CHF ? displayPrice / marketPrices.CHF : 1

  const roundedDisplayLimits = limits
    ? {
      dailyAmount: Math.round(Math.round(limits.dailyAmount * exchangeRate * 100) / 100),
      daily: Math.round(exchangeRate * limits.daily),
      monthlyAnonymous: Math.round(Math.round(limits?.monthlyAnonymous * exchangeRate * 100) / 100),
      monthlyAnonymousAmount: Math.round(exchangeRate * limits?.monthlyAnonymousAmount),
      yearlyAmount: Math.round(Math.round(limits.yearlyAmount * exchangeRate * 100) / 100),
      yearly: Math.round(exchangeRate * limits.yearly),
    }
    : defaultLimits

  return { limits: roundedDisplayLimits }
}
