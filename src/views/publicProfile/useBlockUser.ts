import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { peachAPI } from '../../utils/peachAPI'
import { matchesKeys } from '../search/hooks/useOfferMatches'
import { UserStatus } from './useUserStatus'

export const useBlockUser = (userId: string) => {
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', userId, 'status'] })
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
      const { result: status, error } = await peachAPI.private.user.blockUser({ userId })

      if (error) throw new Error(error.error || "Couldn't block user")
      return status
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['user', userId, 'status'], context?.previousStatus)
      showError(err.message)
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['user', userId, 'status'] }),
        queryClient.invalidateQueries({ queryKey: matchesKeys.matches }),
      ]),
  })
}
