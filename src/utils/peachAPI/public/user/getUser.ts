import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type GetUserProps = RequestProps & {
  userId: User['id']
}

export const getUser = async ({ userId, timeout }: GetUserProps) => {
  const response = await fetch(`${API_URL}/v1/user/${userId}`, {
    headers: getPublicHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<User>(response, 'getUser')
}
