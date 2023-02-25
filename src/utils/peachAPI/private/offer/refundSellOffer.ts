import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type RefundSellOfferProps = RequestProps & {
  offerId: string
  tx: string
}

export const refundSellOffer = async ({
  offerId,
  tx,
  timeout,
}: RefundSellOfferProps): Promise<[RefundSellOfferResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/refund`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      tx,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<RefundSellOfferResponse>(response, 'refundSellOffer')
}
