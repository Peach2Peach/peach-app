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
  paymentData: OfferPaymentData
  releaseAddress: string
  messageSignature?: string
  maxPremium: number | null
}

export const postBuyOffer = async ({
  timeout,
  type,
  amount,
  meansOfPayment,
  paymentData,
  releaseAddress,
  messageSignature,
  maxPremium,
}: Props) => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({ type, amount, meansOfPayment, paymentData, releaseAddress, messageSignature, maxPremium }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<BuyOffer>(response, 'postOffer')
}
