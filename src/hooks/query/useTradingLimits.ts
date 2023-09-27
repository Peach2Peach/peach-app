import { useQuery } from '@tanstack/react-query'
import { useMarketPrices } from '..'
import { useSettingsStore } from '../../store/settingsStore'
import { defaultLimits } from '../../utils/account/account'
import { peachAPI } from '../../utils/peachAPI'

const tradingLimitQuery = async () => {
  const { result, error: err } = await peachAPI.private.user.getTradingLimit()
  if (result && 'error' in result) {
    throw new Error(result?.error)
  }
  if (err) {
    throw new Error(err.error)
  }
  return result
}
export const useTradingLimits = () => {
  const { data: limits } = useQuery({ queryKey: ['tradingLimits'], queryFn: tradingLimitQuery })
  const { data: marketPrices } = useMarketPrices()
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)

  const displayPrice = marketPrices?.[displayCurrency]
  const exchangeRate = displayPrice && marketPrices.CHF ? displayPrice / marketPrices.CHF : 1

  const roundedDisplayLimits = limits
    ? {
      dailyAmount: limits.dailyAmount * exchangeRate,
      daily: exchangeRate * limits.daily,
      monthlyAnonymous: limits?.monthlyAnonymous * exchangeRate,
      monthlyAnonymousAmount: exchangeRate * limits?.monthlyAnonymousAmount,
      yearlyAmount: limits.yearlyAmount * exchangeRate,
      yearly: exchangeRate * limits.yearly,
    }
    : defaultLimits

  return { limits: roundedDisplayLimits }
}
