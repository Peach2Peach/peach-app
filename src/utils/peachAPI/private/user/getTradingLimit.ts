import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPeachAccount } from '../../peachAccount'
import { getPrivateHeaders } from '../getPrivateHeaders'

export const getTradingLimit = async ({ timeout }: RequestProps) => {
  const peachAccount = getPeachAccount()
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user/tradingLimit`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  const parsedResponse = await parseResponse<TradingLimit>(response, 'getTradingLimit')

  if (!parsedResponse[0]) return parsedResponse
  if (parsedResponse[0].daily === null) parsedResponse[0].daily = Infinity
  if (parsedResponse[0].monthlyAnonymous === null) parsedResponse[0].monthlyAnonymous = Infinity
  if (parsedResponse[0].yearly === null) parsedResponse[0].yearly = Infinity

  return parsedResponse
}
