import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetofferDetailsProps = RequestProps & {
  offerId: string
}

/**
 * @description Method to get offer
 * @param offerId offer id
 * @returns GetOffersResponse
 */
export const getOfferDetails = async ({
  offerId,
  timeout,
  abortSignal,
}: GetofferDetailsProps): Promise<[BuyOffer | SellOffer | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/details`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: abortSignal || (timeout ? getAbortWithTimeout(timeout).signal : undefined),
  })

  return await parseResponse<BuyOffer | SellOffer>(response, 'getOffer')
}
