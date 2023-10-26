import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRoute } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'

export function useContractMutation (optimisticContract: Partial<Contract>, options: UseMutationOptions) {
  const { contractId } = useRoute<'contract'>().params
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()

  return useMutation({
    ...options,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contractId])
      queryClient.setQueryData(['contract', contractId], (oldQueryData: GetContractResponse | undefined) => {
        if (!oldQueryData) return oldQueryData
        return {
          ...oldQueryData,
          ...optimisticContract,
          lastModified: new Date(),
        }
      })

      return { previousData }
    },
    onError: (err: Error, _variables: void, context: { previousData: Contract | undefined } | undefined) => {
      queryClient.setQueryData(['contract', contractId], context?.previousData)
      showError(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contract', contractId])
      queryClient.invalidateQueries(['contractSummaries'])
    },
  })
}
