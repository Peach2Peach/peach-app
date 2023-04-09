import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useDisputeRaisedSuccess } from '../../../overlays/dispute/hooks/useDisputeRaisedSuccess'
import { account } from '../../../utils/account'
import { contractIdToHex, getContract, getContractViewer } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { submitRaiseDispute } from '../utils/submitRaiseDispute'

export const disputeReasonsBuyer: DisputeReason[] = ['noPayment.buyer', 'unresponsive.buyer', 'abusive', 'other']
export const disputeReasonsSeller: DisputeReason[] = ['noPayment.seller', 'unresponsive.seller', 'abusive', 'other']

export const useDisputeReasonSelectorSetup = () => {
  const route = useRoute<'disputeReasonSelector'>()
  const contract = getContract(route.params.contractId)

  const view = contract ? getContractViewer(contract, account) : ''
  const availableReasons = view === 'seller' ? disputeReasonsSeller : disputeReasonsBuyer

  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const showDisputeRaisedOverlay = useDisputeRaisedSuccess()

  useHeaderSetup({
    title: i18n('dispute.disputeForTrade', !!contract ? contractIdToHex(contract.id) : ''),
  })

  const setAndSubmit = async (reason: DisputeReason) => {
    const [success, error] = await submitRaiseDispute(contract, reason)
    if (!success || error) {
      showErrorBanner(error?.error)
      return
    }
    if (view) showDisputeRaisedOverlay(view)
    navigation.goBack()
  }

  const setReason = async (reason: DisputeReason) => {
    if (!contract) return
    if (reason === 'noPayment.buyer' || reason === 'noPayment.seller') {
      navigation.navigate('disputeForm', { contractId: contract.id, reason })
      return
    }

    await setAndSubmit(reason)
  }

  return { availableReasons, setReason }
}
