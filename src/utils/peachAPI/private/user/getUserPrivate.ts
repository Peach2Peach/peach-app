import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { fetchAccessToken } from './fetchAccessToken'

type GetUserPrivateProps = RequestProps & { userId: User['id'] }

/**
 * @description Method get user information
 * @returns User
 */
export const getUserPrivate = async ({
  userId,
  timeout,
}: GetUserPrivateProps): Promise<[UserPrivate | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/${userId}`, {
    headers: {
      Authorization: await fetchAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<User>(response, 'getUser')
}
