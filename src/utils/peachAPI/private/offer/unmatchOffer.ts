import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

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
    headers: await getPrivateHeaders(),
    body: JSON.stringify({
      matchingOfferId,
    }),
    method: 'DELETE',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<MatchResponse>(response, 'unmatchOffer')
}
