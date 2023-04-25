import { useCallback } from 'react'
import { useShowLoadingOverlay } from '../../../../hooks/useShowLoadingOverlay'
import { isEmailRequiredForDispute } from '../../../../utils/dispute'
import i18n from '../../../../utils/i18n'
import { isEmail } from '../../../../utils/validation'
import { useSubmitDisputeAcknoledgementMutation } from './useSubmitDisputeAcknoledgementMutation'

export const useSubmitDisputeAcknowledgement = () => {
  const sumbitDispute = useSubmitDisputeAcknoledgementMutation()

  const showLoadingOverlay = useShowLoadingOverlay()

  const submitDisputeAcknowledgement = useCallback(
    async (contract: Contract, reason: DisputeReason, email: string) => {
      if (isEmailRequiredForDispute(reason) && !isEmail(email)) return

      showLoadingOverlay({
        title: i18n('dispute.opened'),
        level: 'WARN',
      })
      sumbitDispute.mutate({
        contractId: contract.id,
        disputeReason: reason,
        email,
      })
    },
    [showLoadingOverlay, sumbitDispute],
  )

  return submitDisputeAcknowledgement
}
