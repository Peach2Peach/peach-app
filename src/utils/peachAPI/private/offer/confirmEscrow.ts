import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type ConfirmEscrowProps = RequestProps & {
  offerId: string
}

export const confirmEscrow = async ({ offerId, timeout }: ConfirmEscrowProps) => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow/confirm`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'confirmEscrow')
}
