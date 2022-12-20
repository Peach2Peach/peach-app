import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPeachAccount } from '../../peachAccount'
import { fetchAccessToken } from './fetchAccessToken'

type LogoutUserProps = RequestProps

/**
 * @description Method to tell peach server that the user logged out
 * @returns APISuccess
 */
export const logoutUser = async ({ timeout }: LogoutUserProps): Promise<[APISuccess | null, APIError | null]> => {
  const peachAccount = getPeachAccount()
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user/logout`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<APISuccess>(response, 'logoutUser')
}
