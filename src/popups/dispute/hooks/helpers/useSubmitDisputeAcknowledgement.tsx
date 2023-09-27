import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Keyboard } from 'react-native'
import { useShowErrorBanner } from '../../../../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../../../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../../../store/usePopupStore'
import { account } from '../../../../utils/account'
import { saveContract } from '../../../../utils/contract'
import { isEmailRequiredForDispute } from '../../../../utils/dispute'
import i18n from '../../../../utils/i18n'
import { peachAPI } from '../../../../utils/peachAPI'
import { isEmail } from '../../../../utils/validation'

const acknowledgeDisputeMutation = async (contractId: string, email: string, disputeReason: DisputeReason) => {
  if (isEmailRequiredForDispute(disputeReason) && !isEmail(email)) {
    throw new Error('INVALID_EMAIL')
  }
  const { result, error: err } = await peachAPI.private.contract.acknowledgeDispute({
    contractId,
    email,
  })
  if (result) {
    return result
  } else if (err) {
    throw new Error(err.error)
  }
  throw new Error('UNKNOWN_ERROR')
}

export const useSubmitDisputeAcknowledgement = () => {
  const closePopup = usePopupStore((state) => state.closePopup)
  const queryClient = useQueryClient()
  const showError = useShowErrorBanner()
  const showLoadingPopup = useShowLoadingPopup()
  const { mutate: submitAcknowledgementMutation } = useMutation({
    onMutate: async ({ contractId }) => {
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousContract = queryClient.getQueryData<Contract>(['contract', contractId])
      showLoadingPopup({
        title: i18n('dispute.opened'),
        level: 'WARN',
      })
      queryClient.setQueryData(
        ['contract', contractId],
        (oldQueryData: Contract | undefined) =>
          oldQueryData && {
            ...oldQueryData,
            disputeDate: new Date(Date.now()),
            disputeInitiator:
              oldQueryData.seller.id === account.publicKey ? oldQueryData.buyer.id : oldQueryData.seller.id,
            disputeAcknowledgedByCounterParty: true,
            isEmailRequired: false,
          },
      )
      return { previousContract }
    },
    mutationFn: ({
      contractId,
      email,
      disputeReason,
    }: {
      email: string
      disputeReason: DisputeReason
      contractId: string
    }) => acknowledgeDisputeMutation(contractId, email, disputeReason),
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
    },
    onSettled: (_data, _error, { contractId }) => {
      closePopup()
      queryClient.invalidateQueries(['contract', contractId])
    },
  })

  const submitDisputeAcknowledgement = ({
    contractId,
    email,
    disputeReason,
  }: {
    contractId: string
    email: string
    disputeReason: DisputeReason
  }) => {
    if (isEmailRequiredForDispute(disputeReason) && !isEmail(email)) return
    submitAcknowledgementMutation({ contractId, email, disputeReason })
  }

  return submitDisputeAcknowledgement
}
