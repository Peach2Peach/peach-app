import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type Props = RequestProps & {
  contractId: Contract['id']
}

export const extendPaymentTimer = async ({ contractId, timeout }: Props) => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/extendTime`, {
    headers: await getPrivateHeaders(),
    method: 'PATCH',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<ExtendPaymentTimerResponseBody>(response, 'extendPaymentTimer')
}
