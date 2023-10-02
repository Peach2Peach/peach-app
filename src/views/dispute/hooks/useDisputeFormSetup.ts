import { useMemo, useState } from 'react'
import { Keyboard } from 'react-native'
import { useHeaderSetup, useNavigation, useRoute, useValidatedState } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useDisputeRaisedSuccess } from '../../../popups/dispute/hooks/useDisputeRaisedSuccess'
import { contractIdToHex, getContract, getContractViewer } from '../../../utils/contract'
import { isEmailRequiredForDispute } from '../../../utils/dispute'
import i18n from '../../../utils/i18n'
import { submitRaiseDispute } from '../utils/submitRaiseDispute'

const required = { required: true }

export const useDisputeFormSetup = () => {
  const route = useRoute<'disputeForm'>()
  const navigation = useNavigation()

  const reason = route.params.reason
  const contractId = route.params.contractId
  const contract = getContract(contractId)
  const emailRules = useMemo(
    () => ({ email: isEmailRequiredForDispute(reason), required: isEmailRequiredForDispute(reason) }),
    [reason],
  )
  const [email, setEmail, emailIsValid, emailErrors] = useValidatedState<string>('', emailRules)
  const [message, setMessage, messageIsValid, messageErrors] = useValidatedState<string>('', required)
  const [loading, setLoading] = useState(false)
  const isFormValid = emailIsValid && messageIsValid

  const disputeRaisedPopup = useDisputeRaisedSuccess()

  const showErrorBanner = useShowErrorBanner()

  useHeaderSetup(i18n('dispute.disputeForTrade', contractIdToHex(contractId)))

  const submit = async () => {
    Keyboard.dismiss()

    if (!contract?.symmetricKey || !isFormValid) return

    setLoading(true)
    const [disputeRaised, disputeRaisedError] = await submitRaiseDispute(contract, reason, email, message)
    if (disputeRaised) {
      navigation.navigate('contractChat', { contractId })
      disputeRaisedPopup(getContractViewer(contract.seller.id))
    } else {
      showErrorBanner(disputeRaisedError?.error)
    }
    setLoading(false)
  }

  return {
    email,
    setEmail,
    emailErrors,
    reason,
    message,
    setMessage,
    messageErrors,
    isFormValid,
    submit,
    loading,
    showErrorBanner,
  }
}
