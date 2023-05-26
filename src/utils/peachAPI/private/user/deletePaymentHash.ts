import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type Props = RequestProps

export const deletePaymentHash = async ({ timeout }: Props): Promise<[APISuccess | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/paymentHash`, {
    headers: await getPrivateHeaders(),
    method: 'DELETE',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'deletePaymentHash')
}
