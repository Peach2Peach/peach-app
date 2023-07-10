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
  price: number
  symmetricKeyEncrypted?: string
  symmetricKeySignature?: string
  paymentDataEncrypted?: string
  paymentDataSignature?: string
}

export const matchOffer = async ({
  offerId,
  currency,
  paymentMethod,
  price,
  matchingOfferId,
  symmetricKeyEncrypted,
  symmetricKeySignature,
  paymentDataEncrypted,
  paymentDataSignature,
  timeout,
}: MatchProps) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: await getPrivateHeaders(),
    body: JSON.stringify({
      matchingOfferId,
      currency,
      paymentMethod,
      price,
      symmetricKeyEncrypted,
      symmetricKeySignature,
      paymentDataEncrypted,
      paymentDataSignature,
    }),
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<MatchResponse>(response, 'matchOffer')
}
