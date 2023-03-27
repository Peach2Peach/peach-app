import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

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
    headers: getPublicHeaders(),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })
  return await parseResponse<PeachPairInfo>(response, 'marketPrice')
}
