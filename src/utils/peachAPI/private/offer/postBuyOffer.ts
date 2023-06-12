import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type Props = RequestProps & {
  type: 'bid'
  amount: [number, number]
  meansOfPayment: MeansOfPayment
  paymentData: Offer['paymentData']
  releaseAddress: string
}

export const postBuyOffer = async ({ timeout, type, amount, meansOfPayment, paymentData, releaseAddress }: Props) => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({ type, amount, meansOfPayment, paymentData, releaseAddress }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<PostOfferResponseBody>(response, 'postOffer')
}
