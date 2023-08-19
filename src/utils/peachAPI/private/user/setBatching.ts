import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

export type Props = RequestProps & {
  enableBatching: boolean
}

export const setBatching = async ({ enableBatching, timeout }: Props) => {
  const response = await fetch(`${API_URL}/v1/user/batching`, {
    headers: await getPrivateHeaders(),
    method: 'POST',
    body: JSON.stringify({ enableBatching }),
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'setBatching')
}
