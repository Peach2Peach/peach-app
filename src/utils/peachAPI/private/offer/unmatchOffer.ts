import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type UnmatchProps = RequestProps & {
  offerId: string
  matchingOfferId: string
}

/**
 * @description Method to match an offer
 * @returns MatchResponse
 */
export const unmatchOffer = async ({
  offerId,
  matchingOfferId,
  timeout,
}: UnmatchProps): Promise<[MatchResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      matchingOfferId,
    }),
    method: 'DELETE',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<MatchResponse>(response, 'unmatchOffer')
}
