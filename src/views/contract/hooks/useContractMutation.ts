import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'

export function useContractMutation<TData = unknown, TVariables = void> (
  optimisticContract: Partial<Contract> & { id: string },
  options: UseMutationOptions<TData, Error, TVariables>,
) {
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()

  return useMutation({
    ...options,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', optimisticContract.id] })
      const previousData = queryClient.getQueryData<Contract>(['contract', optimisticContract.id])
      queryClient.setQueryData(['contract', optimisticContract.id], (oldQueryData: Contract | undefined) => {
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
      queryClient.setQueryData(['contract', optimisticContract.id], context?.previousData)
      showError(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', optimisticContract.id] })
      queryClient.invalidateQueries({ queryKey: ['contractSummaries'] })
    },
  })
}
