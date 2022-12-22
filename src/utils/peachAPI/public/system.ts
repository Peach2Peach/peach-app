import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch, { getAbortWithTimeout } from '../../fetch'
import { parseResponse } from '../parseResponse'

type GetStatusProps = RequestProps

/**
 * @description Method get system status information
 * @returns GetStatusResponse
 */
export const getStatus = async ({ timeout }: GetStatusProps): Promise<[GetStatusResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/system/status`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<GetStatusResponse>(response, 'getStatus')
}

type GetInfoProps = RequestProps

/**
 * @description Method get information about peach trading platform
 * @returns GetTxResponse
 */
export const getInfo = async ({ timeout }: GetInfoProps): Promise<[GetInfoResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/info`, {
    headers: {
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<GetInfoResponse>(response, 'getInfo')
}
