import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from '../user'

type GetMatchesProps = {
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
}: GetMatchesProps): Promise<[GetMatchesResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/matches?page=${page}&size=${size}`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<GetMatchesResponse>(response, 'getMatches')
}