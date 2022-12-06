import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch, { getAbortSignal } from '../../fetch'
import { parseResponse } from '../parseResponse'

type GetMarketPricesProps = RequestProps

/**
 * @description Method to get market prices
 * @returns Pricebook
 */
export const marketPrices = async ({ timeout }: GetMarketPricesProps): Promise<[Pricebook | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/market/prices`, {
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })
  return await parseResponse<Pricebook>(response, 'marketPrices')
}

type GetMarketPriceProps = RequestProps & {
  currency: Currency
}

/**
 * @description Method to get market price for given currency
 * @param cyrrency currency to price bitcoin in
 * @returns PeachPairInfo
 */
export const marketPrice = async ({
  currency,
  timeout,
}: GetMarketPriceProps): Promise<[PeachPairInfo | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/market/price/BTC${currency}`, {
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })
  return await parseResponse<PeachPairInfo>(response, 'marketPrice')
}
