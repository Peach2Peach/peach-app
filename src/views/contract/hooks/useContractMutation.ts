import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'

export function useContractMutation<TData = unknown, TVariables = void> (
  contract: Partial<Contract> & { id: string },
  options: UseMutationOptions<TData, Error, TVariables>,
) {
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()

  return useMutation({
    ...options,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contract.id] })
      const previousData = queryClient.getQueryData<Contract>(['contract', contract.id])
      queryClient.setQueryData(['contract', contract.id], (oldQueryData: Contract | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          ...contract,
          lastModified: new Date(),
        }
      })

      return { previousData }
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['contract', contract.id], context?.previousData)
      showError(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contract', contract.id])
      queryClient.invalidateQueries(['contractSummaries'])
    },
  })
}
