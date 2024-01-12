import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRoute } from '../../../hooks/useRoute'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'

export function useContractMutation<TData = unknown, TVariables = void> (
  optimisticContract: Partial<Contract>,
  options: UseMutationOptions<TData, Error, TVariables>,
) {
  const { contractId } = useRoute<'contract'>().params
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()

  return useMutation({
    ...options,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousData = queryClient.getQueryData<Contract>(['contract', contractId])
      queryClient.setQueryData(['contract', contractId], (oldQueryData: Contract | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          ...optimisticContract,
          lastModified: new Date(),
        }
      })

      return { previousData }
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['contract', contractId], context?.previousData)
      showError(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contract', contractId])
      queryClient.invalidateQueries(['contractSummaries'])
    },
  })
}
