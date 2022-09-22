import { API_URL } from '@env'
import { parseResponse, peachAccount } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from './getAccessToken'

/**
 * @description Method to tell peach server that the user logged out
 * @returns APISuccess
 */
export const logoutUser = async (): Promise<[APISuccess | null, APIError | null]> => {
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user/logout`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  })

  return await parseResponse<APISuccess>(response, 'logoutUser')
}
