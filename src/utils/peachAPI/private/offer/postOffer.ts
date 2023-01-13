import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type PostOfferProps = RequestProps & {
  type: OfferType
  amount: number | [number, number]
  premium?: number
  meansOfPayment: MeansOfPayment
  paymentData?: SellOffer['paymentData']
  kyc: boolean
  returnAddress?: string
  releaseAddress?: string
}

/**
 * @description Method to post offer
 * @param type ask or bid
 * @param amount Amount in sats (250k 500k 1M 2M 5M)
 * @param premium Premium in % (default: 0)
 * @param meansOfPayment mapping of currency and payment methods
 * @param kyc If true, require KYC
 * @param returnAddress Bitcoin address to return funds to in case of cancellation
 * @returns PostOfferResponse
 */
export const postOffer = async ({
  type,
  amount,
  premium = 0,
  meansOfPayment,
  paymentData,
  kyc,
  returnAddress,
  releaseAddress,
  timeout,
}: PostOfferProps): Promise<[PostOfferResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      type,
      amount,
      premium,
      meansOfPayment,
      paymentData,
      kyc,
      returnAddress,
      releaseAddress,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<PostOfferResponse>(response, 'postOffer')
}
