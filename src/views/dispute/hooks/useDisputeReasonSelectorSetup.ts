import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useDisputeRaisedSuccess } from '../../../popups/dispute/hooks/useDisputeRaisedSuccess'
import { account } from '../../../utils/account'
import { getContractViewer } from '../../../utils/contract'
import { useDecryptedContractData } from '../../contractChat/useDecryptedContractData'
import { submitRaiseDispute } from '../utils/submitRaiseDispute'
import { disputeReasons } from './disputeReasons'

export const useDisputeReasonSelectorSetup = (contract: Contract) => {
  const { data: decrptedData } = useDecryptedContractData(contract)

  const view = getContractViewer(contract, account)
  const availableReasons = view === 'seller' ? disputeReasons.seller : disputeReasons.buyer

  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const showDisputeRaisedPopup = useDisputeRaisedSuccess()

  const setAndSubmit = async (reason: DisputeReason) => {
    const [success, error] = await submitRaiseDispute({ contract, reason, symmetricKey: decrptedData?.symmetricKey })
    if (!success || error) {
      showErrorBanner(error?.error)
      return
    }
    if (view) showDisputeRaisedPopup(view)
    navigation.goBack()
  }

  const setReason = async (reason: DisputeReason) => {
    if (reason === 'noPayment.buyer' || reason === 'noPayment.seller') {
      navigation.navigate('disputeForm', { contractId: contract.id, reason })
      return
    }

    await setAndSubmit(reason)
  }

  return { availableReasons, setReason }
}
