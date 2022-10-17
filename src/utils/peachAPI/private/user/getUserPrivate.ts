import { API_URL } from '@env'
import { parseResponse } from '../..'
import fetch from '../../../fetch'
import { getAccessToken } from './getAccessToken'

/**
 * @description Method get user information
 * @returns User
 */
export const getUserPrivate = async (userId: User['id']): Promise<[User | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/${userId}`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  return await parseResponse<User>(response, 'getUser')
}
