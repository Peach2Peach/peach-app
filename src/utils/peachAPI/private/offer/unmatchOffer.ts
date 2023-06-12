import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type UnmatchProps = RequestProps & {
  offerId: string
  matchingOfferId: string
}

export const unmatchOffer = async ({ offerId, matchingOfferId, timeout }: UnmatchProps) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: await getPrivateHeaders(),
    body: JSON.stringify({
      matchingOfferId,
    }),
    method: 'DELETE',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<MatchResponse>(response, 'unmatchOffer')
}
