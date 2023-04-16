import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type extendPaymentTimeProps = RequestProps & {
  contractId: Contract['id']
}

export const extendPaymentTimer = async ({
  contractId,
  timeout,
}: extendPaymentTimeProps): Promise<[ExtendPaymentTimerResponseBody | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/extendTime`, {
    headers: await getPrivateHeaders(),
    method: 'PATCH',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<ExtendPaymentTimerResponseBody>(response, 'extendPaymentTimer')
}
