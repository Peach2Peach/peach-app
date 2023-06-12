import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

export const getInfo = async ({ timeout }: RequestProps) => {
  const response = await fetch(`${API_URL}/v1/info`, {
    headers: {
      ...getPublicHeaders(),
      'Cache-Control': 'no-cache',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<GetInfoResponse>(response, 'getInfo')
}
