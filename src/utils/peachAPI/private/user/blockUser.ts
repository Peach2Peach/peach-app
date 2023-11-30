import { API_URL } from '@env'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RequestProps } from '../..'
import { useShowErrorBanner } from '../../../../hooks/useShowErrorBanner'
import { UserStatus } from '../../../../views/publicProfile/useUserStatus'
import fetch from '../../../fetch'
import { getAbortWithTimeout } from '../../../getAbortWithTimeout'
import { parseResponse } from '../../parseResponse'
import { getPrivateHeaders } from '../getPrivateHeaders'

type GetUserProps = RequestProps & {
  userId: User['id']
}

const blockUser = async ({ userId, timeout }: GetUserProps) => {
  const response = await fetch(`${API_URL}/v1/user/${userId}/block`, {
    headers: await getPrivateHeaders(),
    method: 'PUT',
    signal: timeout ? getAbortWithTimeout(timeout).signal : undefined,
  })

  return parseResponse<APISuccess>(response, 'blockUser')
}

export const useBlockUser = (userId: string) => {
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['user', userId, 'status'])
      const previousStatus = queryClient.getQueryData<UserStatus>(['user', userId, 'status'])
      queryClient.setQueryData<UserStatus>(['user', userId, 'status'], (oldQueryData: UserStatus) => {
        if (oldQueryData) {
          return {
            ...oldQueryData,
            isBlocked: true,
          }
        }
        return undefined
      })
      return { previousStatus }
    },
    mutationFn: async () => {
      const [status, error] = await blockUser({ userId })

      if (error) throw new Error(error.error)
      return status
    },
    onError: (err: Error, _variables, context) => {
      queryClient.setQueryData(['user', userId, 'status'], context?.previousStatus)
      showError(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', userId, 'status'])
    },
  })
}
