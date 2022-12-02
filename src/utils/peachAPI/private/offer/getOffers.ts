import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

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
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<(SellOffer | BuyOffer)[]>(response, 'getOffers')
}
