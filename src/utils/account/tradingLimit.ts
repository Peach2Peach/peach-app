import { account } from '.'
import { SATSINBTC } from '../../constants'
import { getBitcoinContext } from '../../contexts/bitcoin'
import { defaultAccount } from './account'
import { storeTradingLimit } from './storeAccount'

/**
 * @description Method to get trading limit of account
 */
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
  }
  if (save && account.publicKey) await storeTradingLimit(account.tradingLimit)
}

/**
 * @description Method to filter out buckets that are above user's trading limit
 * @param buckets buckets
 * @param price price in CHF
 * @param tradingLimit user trading limit
 * @returns filtered buckets
 */
export const applyTradingLimit = (buckets: number[], price: number, tradingLimit: TradingLimit) =>
  buckets.filter((bucket) => {
    if (!price) return true

    const amount = (bucket * price) / SATSINBTC

    return amount < tradingLimit.daily && amount < tradingLimit.yearly
  })
