import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type GetStatusProps = RequestProps

/**
 * @description Method get system status information
 * @returns GetStatusResponse
 */
export const getStatus = async ({ timeout }: GetStatusProps): Promise<[GetStatusResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/system/status`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<GetStatusResponse>(response, 'getStatus')
}
