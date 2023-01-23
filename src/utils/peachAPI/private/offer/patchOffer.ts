import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type PatchOfferProps = RequestProps & {
  offerId: Offer['id']
  refundTx?: string
}

export const patchOffer = async ({
  offerId,
  refundTx,
  timeout,
}: PatchOfferProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({
      refundTx,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'patchOffer')
}
