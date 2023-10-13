import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Keyboard } from 'react-native'
import { useShowErrorBanner } from '../../../../hooks/useShowErrorBanner'
import { usePopupStore } from '../../../../store/usePopupStore'
import { saveContract } from '../../../../utils/contract'
import { isEmailRequiredForDispute } from '../../../../utils/dispute'
import { acknowledgeDispute } from '../../../../utils/peachAPI/private/contract'
import { isEmail } from '../../../../utils/validation'

export const useSubmitDisputeAcknowledgement = () => {
  const closePopup = usePopupStore((state) => state.closePopup)
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()
  const { mutate: submitDisputeAcknowledgement } = useMutation({
    onMutate: async ({ contractId }) => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousContract = queryClient.getQueryData<Contract>(['contract', contractId])
      queryClient.setQueryData(
        ['contract', contractId],
        (oldQueryData: Contract | undefined) =>
          oldQueryData && {
            ...oldQueryData,
            isEmailRequired: false,
          },
      )
      return { previousContract }
    },
    mutationFn: async ({
      contractId,
      email,
      disputeReason,
    }: {
      email: string
      disputeReason: DisputeReason
      contractId: string
    }) => {
      if (isEmailRequiredForDispute(disputeReason) && !isEmail(email)) {
        throw new Error('INVALID_EMAIL')
      }
      const [result, err] = await acknowledgeDispute({
        contractId,
        email,
      })
      if (result) {
        return result
      } else if (err) {
        throw new Error(err.error)
      }
      throw new Error('UNKNOWN_ERROR')
    },
    onError: (err: Error, { contractId }, context) => {
      showError(err.message)
      queryClient.setQueryData(['contract', contractId], context?.previousContract)
    },
    onSuccess: (_data, { disputeReason, contractId }) => {
      const updatedContract = queryClient.getQueryData<Contract>(['contract', contractId])
      if (!updatedContract) return
      saveContract(updatedContract)

      if (isEmailRequiredForDispute(disputeReason)) {
        Keyboard.dismiss()
      }
      closePopup()
    },
    onSettled: (_data, _error, { contractId }) => {
      queryClient.invalidateQueries(['contract', contractId])
    },
  })

  return submitDisputeAcknowledgement
}
