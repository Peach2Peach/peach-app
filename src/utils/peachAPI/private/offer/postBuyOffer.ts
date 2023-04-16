import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type PostOfferProps = RequestProps & {
  type: 'bid'
  amount: [number, number]
  meansOfPayment: MeansOfPayment
  paymentData: Offer['paymentData']
  releaseAddress: string
}

/**
 * @description Method to post offer
 * @param type ask or bid
 * @param amount Amount in sats (250k 500k 1M 2M 5M)
 * @param meansOfPayment mapping of currency and payment methods
 * @param releaseAddress Bitcoin address to send sats to
 * @returns PostOfferResponse
 */
export const postBuyOffer = async ({
  timeout,
  ...requestBody
}: PostOfferProps): Promise<[PostOfferResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify(requestBody),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<PostOfferResponse>(response, 'postOffer')
}
