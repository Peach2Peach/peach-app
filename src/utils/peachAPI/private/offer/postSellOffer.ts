import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type PostOfferProps = RequestProps & {
  type: 'ask'
  premium: number
  amount: number
  meansOfPayment: MeansOfPayment
  paymentData: SellOffer['paymentData']
  returnAddress: string
}

/**
 * @description Method to post offer
 * @param type ask or bid
 * @param premium Premium in % (default: 0)
 * @param meansOfPayment mapping of currency and payment methods
 * @returns PostOfferResponse
 */
export const postSellOffer = async ({
  timeout,
  premium = 0,
  ...requestBody
}: PostOfferProps): Promise<[PostOfferResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({ premium, ...requestBody }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<PostOfferResponse>(response, 'postOffer')
}
