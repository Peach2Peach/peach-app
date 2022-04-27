import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from '../user'

/**
 * @description Method to get offer
 * @param offerId offer id
 * @returns GetOffersResponse
 */
export const getOfferDetails = async (offerId: string): Promise<[BuyOffer|SellOffer|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/details`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<BuyOffer|SellOffer>(response, 'getOffer')
}