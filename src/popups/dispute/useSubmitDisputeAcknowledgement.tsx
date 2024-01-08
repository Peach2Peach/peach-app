import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Keyboard } from 'react-native'
import { useClosePopup } from '../../components/popup/Popup'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { isEmailRequiredForDispute } from '../../utils/dispute/isEmailRequiredForDispute'
import { peachAPI } from '../../utils/peachAPI'
import { isEmail } from '../../utils/validation/isEmail'

export const useSubmitDisputeAcknowledgement = () => {
  const closePopup = useClosePopup()
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
    mutationFn: acknowledgeDispute,
    onError: (err: Error, { contractId }, context) => {
      showError(err.message)
      queryClient.setQueryData(['contract', contractId], context?.previousContract)
    },
    onSuccess: (_data, { disputeReason }) => {
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

async function acknowledgeDispute ({
  contractId,
  email,
  disputeReason,
}: {
  email: string
  disputeReason: DisputeReason
  contractId: string
}) {
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
