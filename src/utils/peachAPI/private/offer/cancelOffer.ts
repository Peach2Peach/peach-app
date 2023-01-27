import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type CancelOfferProps = RequestProps &
  CancelOfferRequest & {
    offerId: string
  }

/**
 * @description Method to get cancel offer and get refunding information
 * @param offerId offer id
 */
export const cancelOffer = async ({
  offerId,
  timeout,
}: CancelOfferProps): Promise<[CancelOfferResponse | null, APIError | null]> => {
  const data: CancelOfferRequest = {}

  const response = await fetch(`${API_URL}/v1/offer/${offerId}/cancel`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<CancelOfferResponse>(response, 'cancelOffer')
}
