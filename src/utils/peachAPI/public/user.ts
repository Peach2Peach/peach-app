import { API_URL } from '@env'
import { parseResponse, RequestProps } from '..'
import fetch, { getAbortSignal } from '../../fetch'

type GetUserProps = RequestProps & {
  userId: User['id']
}

/**
 * @description Method get user information
 * @returns User
 */
export const getUser = async ({ userId, timeout }: GetUserProps): Promise<[User | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/${userId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<User>(response, 'getUser')
}
