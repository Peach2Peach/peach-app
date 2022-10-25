import { API_URL } from '@env'
import { parseResponse, RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { getAccessToken } from '../user'

type GetOfferProps = RequestProps

/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getOffers = async ({
  timeout,
}: GetOfferProps): Promise<[(SellOffer | BuyOffer)[] | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offers`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<(SellOffer | BuyOffer)[]>(response, 'getOffers')
}
