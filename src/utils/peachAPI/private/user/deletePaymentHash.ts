import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type Props = RequestProps & {
  hash: string
}

export const deletePaymentHash = async ({ hash, timeout }: Props): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/paymentHash`, {
    headers: await getPrivateHeaders(),
    method: 'DELETE',
    body: JSON.stringify({
      hash,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'deletePaymentHash')
}
