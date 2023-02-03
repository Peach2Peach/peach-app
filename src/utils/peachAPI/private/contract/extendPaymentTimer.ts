import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from '../user'

type extendPaymentTimeProps = RequestProps & {
  contractId: Contract['id']
}

export const extendPaymentTimer = async ({
  contractId,
  timeout,
}: extendPaymentTimeProps): Promise<[ExtendPaymentTimerResponseBody | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/contract/${contractId}/extendTime`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<ExtendPaymentTimerResponseBody>(response, 'extendPaymentTimer')
}
