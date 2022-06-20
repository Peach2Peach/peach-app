import { account, saveAccount } from '.'
import { SATSINBTC } from '../../constants'
import { getBitcoinContext } from '../../contexts/bitcoin'
import { session } from '../session'
import { defaultAccount } from './account'

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
export const updateTradingLimit = async (tradingLimit: TradingLimit, save?: boolean): Promise<void> => {
  account.tradingLimit = {
    daily: tradingLimit.daily || Infinity,
    dailyAmount: tradingLimit.dailyAmount || 0,
    yearly: tradingLimit.yearly || Infinity,
    yearlyAmount: tradingLimit.yearlyAmount || 0,
  }
  if (save && session.password && account.publicKey) await saveAccount(account, session.password)
}

/**
 * @description Method to filter out buckets that are above user's trading limit
 * @param buckets buckets
 * @param price price in CHF
 * @param tradingLimit user trading limit
 * @returns filtered buckets
 */
export const applyTradingLimit = (buckets: number[], price: number, tradingLimit: TradingLimit) =>
  buckets.filter(bucket => {
    if (!price) return true

    const amount = bucket * price / SATSINBTC

    return amount < tradingLimit.daily && amount < tradingLimit.yearly
  })