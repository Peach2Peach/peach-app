import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

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
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      tx,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<RefundSellOfferResponse>(response, 'refundSellOffer')
}
