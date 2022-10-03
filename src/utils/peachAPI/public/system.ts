import { API_URL } from '@env'
import { parseResponse } from '..'
import fetch from '../../fetch'

/**
 * @description Method get system status information
 * @returns GetStatusResponse
 */
export const getStatus = async (): Promise<[GetStatusResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/system/status`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  return await parseResponse<GetStatusResponse>(response, 'getStatus')
}

/**
 * @description Method get information about peach trading platform
 * @returns GetTxResponse
 */
export const getInfo = async (): Promise<[GetInfoResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/info`, {
    headers: {
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  return await parseResponse<GetInfoResponse>(response, 'getInfo')
}
