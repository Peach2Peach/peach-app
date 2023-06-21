import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type CreateEscrowProps = RequestProps & {
  offerId: string
  publicKey: string
}

export const createEscrow = async ({ offerId, publicKey, timeout }: CreateEscrowProps) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      publicKey,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<CreateEscrowResponse>(response, 'createEscrow')
}
