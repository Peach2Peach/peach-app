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

  const disputeRaisedOverlay = useDisputeRaisedSuccess()

  useHeaderSetup({
    title: i18n('dispute.disputeForTrade', !!contract ? contractIdToHex(contract.id) : ''),
  })

  const setReason = async (reason: DisputeReason) => {
    if (!contract) return
    if (reason === 'noPayment.buyer' || reason === 'noPayment.seller') {
      navigation.navigate('disputeForm', { contractId: contract.id, reason })
    } else {
      const [success, error] = await submitRaiseDispute(contract, reason)
      if (success) {
        if (view) {
          disputeRaisedOverlay(view)
        }
        navigation.goBack()
      } else {
        showErrorBanner(error?.error)
      }
    }
  }

  return { availableReasons, setReason }
}
