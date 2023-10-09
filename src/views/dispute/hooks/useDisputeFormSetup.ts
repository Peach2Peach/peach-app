import { useMemo, useState } from 'react'
import { Keyboard } from 'react-native'
import { useNavigation, useRoute, useValidatedState } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useDisputeRaisedSuccess } from '../../../popups/dispute/hooks/useDisputeRaisedSuccess'
import { account } from '../../../utils/account'
import { getContractViewer } from '../../../utils/contract'
import { isEmailRequiredForDispute } from '../../../utils/dispute'
import { useDecryptedContractData } from '../../contractChat/useDecryptedContractData'
import { submitRaiseDispute } from '../utils/submitRaiseDispute'

const required = { required: true }

export const useDisputeFormSetup = (contract: Contract) => {
  const navigation = useNavigation()
  const { reason, contractId } = useRoute<'disputeForm'>().params
  const { data: decrptedData } = useDecryptedContractData(contract)

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

  const submit = async () => {
    Keyboard.dismiss()

    if (!decrptedData?.symmetricKey || !isFormValid) return

    setLoading(true)
    const [disputeRaised, disputeRaisedError] = await submitRaiseDispute({
      contract,
      reason,
      email,
      message,
      symmetricKey: decrptedData.symmetricKey,
    })
    if (disputeRaised) {
      navigation.navigate('contractChat', { contractId })
      disputeRaisedPopup(getContractViewer(contract, account))
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
