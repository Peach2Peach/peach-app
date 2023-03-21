import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

export type MatchProps = RequestProps & {
  offerId: string
  matchingOfferId: string
  currency: Currency
  paymentMethod: PaymentMethod
  symmetricKeyEncrypted?: string
  symmetricKeySignature?: string
  paymentDataEncrypted?: string
  paymentDataSignature?: string
  hashedPaymentData?: string
}

/**
 * @description Method to match an offer
 * @returns MatchResponse
 */
export const matchOffer = async ({
  offerId,
  currency,
  paymentMethod,
  matchingOfferId,
  symmetricKeyEncrypted,
  symmetricKeySignature,
  paymentDataEncrypted,
  paymentDataSignature,
  hashedPaymentData,
  timeout,
}: MatchProps): Promise<[MatchResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      matchingOfferId,
      currency,
      paymentMethod,
      symmetricKeyEncrypted,
      symmetricKeySignature,
      paymentDataEncrypted,
      paymentDataSignature,
      hashedPaymentData,
    }),
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<MatchResponse>(response, 'matchOffer')
}
