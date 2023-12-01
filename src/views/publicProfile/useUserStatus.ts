import { useQuery } from '@tanstack/react-query'
import { peachAPI } from '../../utils/peachAPI'

export type UserStatus = Awaited<ReturnType<typeof peachAPI.private.user.getUserStatus>>['result']

export function useUserStatus (userId: string) {
  return useQuery({
    queryKey: ['user', userId, 'status'],
    queryFn: async () => {
      const { result: status, error } = await peachAPI.private.user.getUserStatus({ userId })

      if (error) throw new Error(error?.error || "Error fetching user's status")
      return status
    },
  })
}
