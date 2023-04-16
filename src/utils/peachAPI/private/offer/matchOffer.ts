import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

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
    headers: await getPrivateHeaders(),
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
