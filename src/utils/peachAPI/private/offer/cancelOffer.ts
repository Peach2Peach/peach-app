import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type CancelOfferProps = RequestProps &
  CancelOfferRequest & {
    offerId: string
  }

export const cancelOffer = async ({ offerId, timeout }: CancelOfferProps) => {
  const data: CancelOfferRequest = {}

  const response = await fetch(`${API_URL}/v1/offer/${offerId}/cancel`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify(data),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<CancelOfferResponse>(response, 'cancelOffer')
}
