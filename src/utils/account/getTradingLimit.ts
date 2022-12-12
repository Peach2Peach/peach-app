import { account } from '.'
import { getBitcoinContext } from '../../contexts/bitcoin'
import { defaultAccount } from './account'

export const getTradingLimit = (currency?: Currency): TradingLimit => {
  const { prices } = getBitcoinContext()
  let exchangeRate = 1
  const tradingLimit = account.tradingLimit || defaultAccount.tradingLimit

  if (currency) exchangeRate = prices[currency]! / prices.CHF!

  return {
    daily: Math.round(tradingLimit.daily * exchangeRate),
    dailyAmount: Math.round(tradingLimit.dailyAmount * exchangeRate * 100) / 100,
    yearly: Math.round(tradingLimit.yearly * exchangeRate),
    yearlyAmount: Math.round(tradingLimit.yearlyAmount * exchangeRate * 100) / 100,
  }
}
