import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type ReviveSellOfferProps = RequestProps & {
  offerId: string
}

export const reviveSellOffer = async ({ offerId, timeout }: ReviveSellOfferProps) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/revive`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<ReviveSellOfferResponseBody>(response, 'reviveSellOffer')
}
