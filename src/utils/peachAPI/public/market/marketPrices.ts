import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

export const marketPrices = async ({ timeout }: RequestProps) => {
  const response = await fetch(`${API_URL}/v1/market/prices`, {
    headers: getPublicHeaders(),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })
  return parseResponse<Pricebook>(response, 'marketPrices')
}
