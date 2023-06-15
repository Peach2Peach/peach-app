import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch from '../../fetch'
import { getAbortWithTimeout } from '../../getAbortWithTimeout'
import { parseResponse } from '../parseResponse'
import { getPublicHeaders } from '../public/getPublicHeaders'

export const generateBlock = async ({ timeout }: RequestProps) => {
  const response = await fetch(`${API_URL}/v1/regtest/generateBlock`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<GenerateBlockResponse>(response, 'generateBlock')
}
