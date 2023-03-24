import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch, { getAbortWithTimeout } from '../../../fetch'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

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
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<UserPrivate>(response, 'getUser')
}
