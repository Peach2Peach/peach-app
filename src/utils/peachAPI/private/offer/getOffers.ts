import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from '../user'

/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getOffers = async (): Promise<[(SellOffer|BuyOffer)[]|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offers`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<(SellOffer|BuyOffer)[]>(response, 'getOffers')
}