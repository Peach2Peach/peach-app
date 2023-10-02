import { useCallback } from 'react'
import { useNavigation, useValidatedState } from '../../../hooks'
import { usePopupStore } from '../../../store/usePopupStore'
import { isEmailRequiredForDispute } from '../../../utils/dispute'
import i18n from '../../../utils/i18n'
import { DisputeRaisedNotice } from '../components/DisputeRaisedNotice'
import { useSubmitDisputeAcknowledgement } from './helpers/useSubmitDisputeAcknowledgement'

const emailRules = { required: true, email: true }

export const useDisputeRaisedNotice = () => {
  const navigation = useNavigation()
  const setPopup = usePopupStore((state) => state.setPopup)
  const [email, setEmail, , emailErrors] = useValidatedState<string>('', emailRules)
  const submitDisputeAcknowledgement = useSubmitDisputeAcknowledgement()

  const showDisputeRaisedNotice = useCallback(
    (contract: Pick<Contract, 'id' | 'disputeReason' | 'amount'>, view: ContractViewer) => {
      const submit = () => {
        submitDisputeAcknowledgement({
          contractId: contract.id,
          disputeReason: contract.disputeReason || 'other',
          email,
        })
      }
      const submitAndGoToChat = () => {
        submit()
        navigation.replace('contractChat', { contractId: contract.id })
      }

      const action2 = !isEmailRequiredForDispute(contract.disputeReason ?? 'other')
        ? {
          label: i18n('close'),
          icon: 'xSquare',
          callback: submit,
        }
        : undefined

      const action1 = isEmailRequiredForDispute(contract.disputeReason ?? 'other')
        ? {
          label: i18n('send'),
          icon: 'arrowRightCircle',
          callback: submit,
        }
        : {
          label: i18n('goToChat'),
          icon: 'messageCircle',
          callback: submitAndGoToChat,
        }

      setPopup({
        title: i18n('dispute.opened'),
        level: 'WARN',
        content: (
          <DisputeRaisedNotice
            {...{ contract, view, email, setEmail, action1, action2 }}
            disputeReason={contract.disputeReason ?? 'other'}
          />
        ),
        visible: true,
        action2,
        action1,
      })

      return {
        submitAndClose: submit,
        submitAndGoToChat,
      }
    },
    [email, navigation, setEmail, setPopup, submitDisputeAcknowledgement],
  )

  return {
    showDisputeRaisedNotice,
    email,
    setEmail,
    emailErrors,
  }
}
