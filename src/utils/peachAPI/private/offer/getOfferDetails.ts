import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

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
}: GetofferDetailsProps): Promise<[BuyOffer | SellOffer | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/details`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<BuyOffer | SellOffer>(response, 'getOffer')
}
