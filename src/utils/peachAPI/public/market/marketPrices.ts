import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type GetMarketPricesProps = RequestProps

/**
 * @description Method to get market prices
 * @returns Pricebook
 */
export const marketPrices = async ({ timeout }: GetMarketPricesProps): Promise<[Pricebook | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/market/prices`, {
    headers: getPublicHeaders(),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })
  return await parseResponse<Pricebook>(response, 'marketPrices')
}
