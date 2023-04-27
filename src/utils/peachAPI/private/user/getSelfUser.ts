import { API_URL } from '@env'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type Props = RequestProps

export const getSelfUser = async ({ timeout }: Props): Promise<[UserPrivate | null, APIError | null]> => {
  const response = await fetch(`${API_URL}/v1/user/me`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return await parseResponse<UserPrivate>(response, 'getUser')
}
