import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type Props = RequestProps & {
  hashes: string[]
}

export const deletePaymentHash = async ({ hashes, timeout }: Props) => {
  const response = await fetch(`${API_URL}/v1/user/paymentHash`, {
    headers: await getPrivateHeaders(),
    method: 'DELETE',
    body: JSON.stringify({
      hashes,
    }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'deletePaymentHash')
}
