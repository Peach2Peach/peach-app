import { API_URL } from '@env'
import { parseResponse } from '..'
import fetch from '../../fetch'

/**
 * @description Method to mine a block on regtest
 * @param offerId offer id
 * @returns GenerateBlockResponse
 */
export const generateBlock = async (): Promise<[GenerateBlockResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/regtest/generateBlock`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<GenerateBlockResponse>(response, 'generateBlock')
}