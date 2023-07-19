import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type PatchOfferProps = RequestProps & {
  offerId: Offer['id']
  refundAddress?: string
  refundTx?: string
  premium?: number
  maxPremium?: number | null
}

export const patchOffer = async ({
  offerId,
  refundAddress,
  refundTx,
  premium,
  timeout,
  maxPremium,
}: PatchOfferProps) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}`, {
    headers: await getPrivateHeaders(),
    method: 'PATCH',
    body: JSON.stringify({
      refundAddress,
      refundTx,
      premium,
      maxPremium,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'patchOffer')
}
