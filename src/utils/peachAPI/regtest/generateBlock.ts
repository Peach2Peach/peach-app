import { API_URL } from '@env'
import { parseResponse, RequestProps } from '..'
import fetch, { getAbortSignal } from '../../fetch'

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
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<GenerateBlockResponse>(response, 'generateBlock')
}
