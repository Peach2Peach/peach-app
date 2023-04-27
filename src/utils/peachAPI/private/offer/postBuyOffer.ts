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

export const postBuyOffer = async ({
  timeout,
  ...requestBody
}: PostOfferProps): Promise<[PostOfferResponseBody | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify(requestBody),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<PostOfferResponseBody>(response, 'postOffer')
}
