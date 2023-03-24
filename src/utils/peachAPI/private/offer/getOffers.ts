import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetOfferProps = RequestProps

/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getOffers = async ({
  timeout,
  abortSignal,
}: GetOfferProps): Promise<[GetOffersResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offers`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<GetOffersResponse>(response, 'getOffers')
}
