import { API_URL } from '@env'
import { useQuery } from '@tanstack/react-query'
import { RequestProps } from '../..'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

export type UserStatus = {
  isBlocked: boolean
}

const getUserStatus = async ({ timeout, userId }: RequestProps & { userId: string }) => {
  const response = await fetch(`${API_URL}/v1/user/${userId}/status`, {
    headers: await getPrivateHeaders(),
    method: 'GET',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<UserStatus>(response, 'getUserStatus')
}

export const useUserStatus = (userId: string) =>
  useQuery({
    queryKey: ['user', userId, 'status'],
    queryFn: async () => {
      const [status, error] = await getUserStatus({ userId, timeout: 5000 })

      if (error) throw new Error(error.error)
      return status
    },
  })
