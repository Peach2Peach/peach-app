import { API_URL } from '@env'
import { RequestProps } from '..'
import fetch, { getAbortWithTimeout } from '../../fetch'
import { parseResponse } from '../parseResponse'
import { getPublicHeaders } from '../public/getPublicHeaders'

type GenerateBlockProps = RequestProps

/**
 * @description Method to mine a block on regtest
 * @param offerId offer id
 * @returns GenerateBlockResponse
 */
export const generateBlock = async ({
  timeout,
}: GenerateBlockProps): Promise<[GenerateBlockResponse | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/regtest/generateBlock`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<GenerateBlockResponse>(response, 'generateBlock')
}
