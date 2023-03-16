import { account } from '.'
import { bitcoinStore } from '../../store/bitcoinStore'
import { defaultAccount } from './account'
import { storeTradingLimit } from './storeAccount'

/**
 * @description Method to get trading limit of account
 */
export const getTradingLimit = (currency?: Currency): TradingLimit => {
  const { prices } = bitcoinStore.getState()
  let exchangeRate = 1
  const tradingLimit = account.tradingLimit || defaultAccount.tradingLimit

  if (currency) exchangeRate = prices[currency]! / prices.CHF!

  return {
    daily: Math.round(tradingLimit.daily * exchangeRate),
    dailyAmount: Math.round(tradingLimit.dailyAmount * exchangeRate * 100) / 100,
    yearly: Math.round(tradingLimit.yearly * exchangeRate),
    yearlyAmount: Math.round(tradingLimit.yearlyAmount * exchangeRate * 100) / 100,
    monthlyAnonymous: Math.round(tradingLimit.monthlyAnonymous * exchangeRate),
    monthlyAnonymousAmount: Math.round(tradingLimit.monthlyAnonymousAmount * exchangeRate * 100) / 100,
  }
}

/**
 * @description Method to update trading limit of account
 * @param tradingLimit tradingLimit to update
 */
export const updateTradingLimit = async (tradingLimit: TradingLimit, save = true): Promise<void> => {
  account.tradingLimit = {
    daily: tradingLimit.daily || Infinity,
    dailyAmount: tradingLimit.dailyAmount || 0,
    yearly: tradingLimit.yearly || Infinity,
    yearlyAmount: tradingLimit.yearlyAmount || 0,
    monthlyAnonymous: tradingLimit.monthlyAnonymous || Infinity,
    monthlyAnonymousAmount: tradingLimit.monthlyAnonymousAmount || 0,
  }
  if (save && account.publicKey) await storeTradingLimit(account.tradingLimit)
}
