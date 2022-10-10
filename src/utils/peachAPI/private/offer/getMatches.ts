import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { getAccessToken } from '../user'

type GetMatchesProps = {
  offerId: string
  page?: number
  size?: number
  timeout?: number
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
}: GetMatchesProps): Promise<[GetMatchesResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/matches?page=${page}&size=${size}`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<GetMatchesResponse>(response, 'getMatches')
}
