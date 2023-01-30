import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type ReviveSellOfferProps = RequestProps & {
  offerId: string
}

/**
 * @description Method to revive sell offer from a canceled contract
 */
export const reviveSellOffer = async ({
  offerId,
  timeout,
}: ReviveSellOfferProps): Promise<[ReviveSellOfferResponseBody | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/revive`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<ReviveSellOfferResponseBody>(response, 'reviveSellOffer')
}
