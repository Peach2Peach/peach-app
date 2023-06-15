import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type GetMarketPriceProps = RequestProps & {
  currency: Currency
}

export const marketPrice = async ({ currency, timeout }: GetMarketPriceProps) => {
  const response = await fetch(`${API_URL}/v1/market/price/BTC${currency}`, {
    headers: getPublicHeaders(),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })
  return parseResponse<PeachPairInfo>(response, 'marketPrice')
}
