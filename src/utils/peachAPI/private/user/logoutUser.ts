import { API_URL } from '@env'
import { parseResponse, peachAccount, RequestProps } from '../..'
import fetch, { getAbortSignal } from '../../../fetch'
import { getAccessToken } from './getAccessToken'

type LogoutUserProps = RequestProps

/**
 * @description Method to tell peach server that the user logged out
 * @returns APISuccess
 */
export const logoutUser = async ({ timeout }: LogoutUserProps): Promise<[APISuccess | null, APIError | null]> => {
  if (!peachAccount) return [null, { error: 'UNAUTHORIZED' }]

  const response = await fetch(`${API_URL}/v1/user/logout`, {
    headers: {
      Authorization: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    signal: timeout ? getAbortSignal(timeout) : undefined,
  })

  return await parseResponse<APISuccess>(response, 'logoutUser')
}
