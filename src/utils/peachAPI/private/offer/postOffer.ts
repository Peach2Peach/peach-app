import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from '../user'

type PostOfferProps = {
  type: OfferType,
  amount: number,
  premium?: number,
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
  kyc: boolean,
  returnAddress?: string,
  releaseAddress?: string
}

/**
 * @description Method to post offer
 * @param type ask or bid
 * @param amount Amount in sats (250k 500k 1M 2M 5M)
 * @param premium Premium in % (default: 0)
 * @param currencies Post offer of specific currency
 * @param paymentMethods Post offer for specific payment methods
 * @param kyc If true, require KYC
 * @param returnAddress Bitcoin address to return funds to in case of cancellation
 * @returns PostOfferResponse
 */
export const postOffer = async ({
  type,
  amount,
  premium = 0,
  currencies,
  paymentMethods,
  kyc,
  returnAddress,
  releaseAddress
}: PostOfferProps): Promise<[PostOfferResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      type,
      amount,
      premium,
      currencies,
      paymentMethods,
      kyc,
      returnAddress,
      releaseAddress
    })
  })

  return await parseResponse<PostOfferResponse>(response, 'postOffer')
}