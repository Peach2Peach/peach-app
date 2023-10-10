import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPublicHeaders } from '../getPublicHeaders'

type GetUserProps = RequestProps & {
  userId: User['id']
}

export const blockUser = async ({ userId, timeout }: GetUserProps) => {
  const response = await fetch(`${API_URL}/v1/user/${userId}/block`, {
    headers: getPublicHeaders(),
    method: 'PUT',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'blockUser')
}
