import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type RateUserProps = RequestProps & {
  contractId: Contract['id']
  rating: 1 | -1
  signature: string
}

export const rateUser = async ({ contractId, rating, signature, timeout }: RateUserProps) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/user/rate`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({
      rating,
      signature,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'rateUser')
}
