import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

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
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(requestBody),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<PostOfferResponse>(response, 'postOffer')
}
