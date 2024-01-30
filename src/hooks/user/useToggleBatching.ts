import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peachAPI } from '../../utils/peachAPI'
import { useShowErrorBanner } from '../useShowErrorBanner'

type Props = Pick<User, 'isBatchingEnabled'>

export const useToggleBatching = ({ isBatchingEnabled }: Props) => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', 'self'] })
      const previousData = queryClient.getQueryData<User>(['user', 'self'])
      queryClient.setQueryData(
        ['user', 'self'],
        (oldQueryData: User | undefined) => oldQueryData && { ...oldQueryData, isBatchingEnabled: !isBatchingEnabled },
      )

      return { previousData }
    },
    mutationFn: async () => {
      const { error } = await peachAPI.private.user.enableTransactionBatching({ enableBatching: !isBatchingEnabled })
      if (error) throw new Error(error.error || 'Failed to toggle batching')
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['user', 'self'], context?.previousData)
      showErrorBanner(err.message)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['user', 'self'] }),
  })
}
