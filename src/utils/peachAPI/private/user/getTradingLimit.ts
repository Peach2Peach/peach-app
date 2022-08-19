import { API_URL } from '@env'
import { parseResponse, peachAccount } from '../..'
import { getAccessToken } from './getAccessToken'

/**
 * @description Method to get trading limit of user
 * @returns TradingLimit
 */
export const getTradingLimit = async (): Promise<[TradingLimit|null, APIError|null]> => {
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user/tradingLimit`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<TradingLimit>(response, 'getTradingLimit')
}