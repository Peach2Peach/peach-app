import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type GetInfoProps = RequestProps

/**
 * @description Method get information about peach trading platform
 * @returns GetTxResponse
 */
export const getInfo = async ({ timeout }: GetInfoProps): Promise<[GetInfoResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/info`, {
    headers: {
      ...getPublicHeaders(),
      'Cache-Control': 'no-cache',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<GetInfoResponse>(response, 'getInfo')
}
