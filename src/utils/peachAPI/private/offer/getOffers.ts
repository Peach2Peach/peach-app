import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

export const getOffers = async ({ timeout, abortSignal }: RequestProps) => {
  const response = await fetch(`${API_URL}/v1/offers`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return parseResponse<GetOffersResponse>(response, 'getOffers')
}
