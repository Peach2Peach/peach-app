import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPeachAccount } from '../../peachAccount'
import { fetchAccessToken } from './fetchAccessToken'

type GetTradingLimitProps = RequestProps

/**
 * @description Method to get trading limit of user
 * @returns TradingLimit
 */
export const getTradingLimit = async ({
  timeout,
}: GetTradingLimitProps): Promise<[TradingLimit | null, APIError | null]> => {
  const peachAccount = getPeachAccount()
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user/tradingLimit`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<TradingLimit>(response, 'getTradingLimit')
}
