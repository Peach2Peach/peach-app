import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type ConfirmEscrowProps = RequestProps & {
  offerId: string
}

/**
 * @description Method to confirm escrow funding
 * @param offerId offer id
 */
export const confirmEscrow = async ({
  offerId,
  timeout,
}: ConfirmEscrowProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow/confirm`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'confirmEscrow')
}
