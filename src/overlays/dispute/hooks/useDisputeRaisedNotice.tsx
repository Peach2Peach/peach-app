import { useCallback } from 'react'
import { useOverlayContext } from '../../../contexts/overlay'
import { useNavigation, useValidatedState } from '../../../hooks'
import { isEmailRequiredForDispute } from '../../../utils/dispute'
import i18n from '../../../utils/i18n'
import DisputeRaisedNotice from '../components/DisputeRaisedNotice'
import { useSubmitDisputeAcknowledgement } from './helpers/useSubmitDisputeAcknowledgement'

const emailRules = { required: true, email: true }

export const useDisputeRaisedNotice = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useOverlayContext()
  const [email, setEmail, , emailErrors] = useValidatedState<string>('', emailRules)
  const submitDisputeAcknowledgement = useSubmitDisputeAcknowledgement()

  const showDisputeRaisedNotice = useCallback(
    (contract: Contract, view: ContractViewer) => {
      const submitAndClose = async () => {
        await submitDisputeAcknowledgement(contract, contract.disputeReason || 'other', email)
      }
      const submitAndGoToChat = async () => {
        await submitDisputeAcknowledgement(contract, contract.disputeReason || 'other', email)
        navigation.replace('contractChat', { contractId: contract.id })
      }
      const submitAndGoToContract = async () => {
        await submitDisputeAcknowledgement(contract, contract.disputeReason || 'other', email)
        navigation.replace('contract', { contractId: contract.id })
      }

      updateOverlay({
        title: i18n('dispute.opened'),
        level: 'WARN',
        content: (
          <DisputeRaisedNotice
            submit={submitDisputeAcknowledgement}
            {...{ contract, view, email, setEmail, emailErrors }}
            disputeReason={contract.disputeReason ?? 'other'}
          />
        ),
        visible: true,
        action2: !isEmailRequiredForDispute(contract.disputeReason ?? 'other')
          ? {
            label: i18n('close'),
            icon: 'xSquare',
            callback: submitAndClose,
          }
          : undefined,
        action1: isEmailRequiredForDispute(contract.disputeReason ?? 'other')
          ? {
            label: i18n('send'),
            icon: 'arrowRightCircle',
            callback: submitAndGoToContract,
          }
          : {
            label: i18n('goToChat'),
            icon: 'messageCircle',
            callback: submitAndGoToChat,
          },
      })

      return {
        submitAndClose,
        submitAndGoToChat,
        submitAndGoToContract,
      }
    },
    [email, emailErrors, navigation, setEmail, submitDisputeAcknowledgement, updateOverlay],
  )

  return {
    showDisputeRaisedNotice,
    email,
    setEmail,
    emailErrors,
  }
}
