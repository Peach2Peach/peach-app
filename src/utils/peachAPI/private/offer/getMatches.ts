import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type GetMatchesProps = RequestProps & {
  offerId: string
  page?: number
  size?: number
}

/**
 * @description Method to get matches of an offer
 * @returns GetOffersResponse
 */
export const getMatches = async ({
  offerId,
  page = 0,
  size = 21,
  timeout,
  abortSignal,
}: GetMatchesProps): Promise<[GetMatchesResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/matches?page=${page}&size=${size}`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  console.log(response)

  return await parseResponse<GetMatchesResponse>(response, 'getMatches')
}
