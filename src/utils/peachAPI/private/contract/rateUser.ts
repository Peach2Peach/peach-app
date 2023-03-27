import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type RateUserProps = RequestProps & {
  contractId: Contract['id']
  rating: 1 | -1
  signature: string
}

/**
 * @description Method to confirm either payment made or received depending on party
 * @param contractId contract id
 * @returns Contract
 */
export const rateUser = async ({
  contractId,
  rating,
  signature,
  timeout,
}: RateUserProps): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/user/rate`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      rating,
      signature,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'rateUser')
}
