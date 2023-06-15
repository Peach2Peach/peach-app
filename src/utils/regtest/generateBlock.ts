import { API_URL } from '@env'
import { parseResponse } from '../peachAPI/parseResponse'
import { getPublicHeaders } from '../peachAPI/public/getPublicHeaders'

export const generateBlock = async () => {
  const response = await fetch(`${API_URL}/v1/regtest/generateBlock`, {
    headers: getPublicHeaders(),
    method: 'GET',
  })

  return parseResponse<GenerateBlockResponse>(response, 'generateBlock')
}
