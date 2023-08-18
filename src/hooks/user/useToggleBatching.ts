import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setBatching } from '../../utils/peachAPI'
import { useShowErrorBanner } from '../useShowErrorBanner'

type Props = Pick<SelfUser, 'isBatchingEnabled'>

export const useToggleBatching = ({ isBatchingEnabled }: Props) => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', 'self'] })
      const previousData = queryClient.getQueryData<SelfUser>(['user', 'self'])
      queryClient.setQueryData(
        ['user', 'self'],
        (oldQueryData: SelfUser | undefined) =>
          oldQueryData && { ...oldQueryData, isBatchingEnabled: !isBatchingEnabled },
      )

      return { previousData }
    },
    mutationFn: async () => {
      const [, error] = await setBatching({ enableBatching: !isBatchingEnabled })
      if (error) throw new Error(error.error)
    },
    onError: (err: Error, _variables, context) => {
      queryClient.setQueryData(['user', 'self'], context?.previousData)
      showErrorBanner(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', 'self'])
    },
  })
}
