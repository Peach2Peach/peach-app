import { SATSINBTC } from '../../constants'

/**
 * @description Method to filter out buckets that are above user's trading limit
 * @returns filtered buckets
 */
export const applyTradingLimit = (buckets: number[], price: number, tradingLimit: TradingLimit) =>
  buckets.filter((bucket) => {
    if (!price) return true

    const amount = (bucket * price) / SATSINBTC

    return amount < tradingLimit.daily && amount < tradingLimit.yearly
  })
