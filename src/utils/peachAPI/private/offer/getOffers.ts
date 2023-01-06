import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

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
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<GetOffersResponse>(response, 'getOffers')
}
