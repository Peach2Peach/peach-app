import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

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
    headers: await getPrivateHeaders(),
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<ReviveSellOfferResponseBody>(response, 'reviveSellOffer')
}
