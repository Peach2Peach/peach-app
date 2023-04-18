import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

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
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify(data),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<CancelOfferResponse>(response, 'cancelOffer')
}
