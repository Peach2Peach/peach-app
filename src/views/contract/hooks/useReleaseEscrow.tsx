import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { signReleaseTxOfContract } from '../../../utils/contract/signReleaseTxOfContract'
import { peachAPI } from '../../../utils/peachAPI'

export const useReleaseEscrow = (contract: Contract) => {
  const showError = useShowErrorBanner()

  const queryClient = useQueryClient()
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['contract', contract.id] })
      const previousData = queryClient.getQueryData<GetContractResponse>(['contract', contract.id])
      queryClient.setQueryData(['contract', contract.id], (old: GetContractResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          paymentConfirmed: new Date(),
          releaseTxId: '',
          disputeResolvedDate: new Date(),
        }
      })
      return { previousData }
    },
    mutationFn: async () => {
      const { releaseTransaction, batchReleasePsbt, errorMsg } = signReleaseTxOfContract(contract)
      if (!releaseTransaction) {
        throw new Error(errorMsg)
      }

      const { error: err } = await peachAPI.private.contract.confirmPaymentSeller({
        contractId: contract.id,
        releaseTransaction,
        batchReleasePsbt,
      })
      if (err) {
        throw new Error(err.error)
      }
    },
    onError: (err: string | undefined, _variables, context) => {
      queryClient.setQueryData(['contract', contract.id], context?.previousData)
      showError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contract', contract.id])
    },
  })
}
