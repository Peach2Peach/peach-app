import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type PatchOfferProps = RequestProps & {
  offerId: Offer['id']
  refundAddress?: string
  refundTx?: string
}

export const patchOffer = async ({
  offerId,
  refundAddress,
  refundTx,
  timeout,
}: PatchOfferProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}`, {
    headers: await getPrivateHeaders(),
    method: 'PATCH',
    body: JSON.stringify({
      refundAddress,
      refundTx,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'patchOffer')
}
