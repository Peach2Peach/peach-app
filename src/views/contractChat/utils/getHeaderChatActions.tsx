import { HeaderConfig } from '../../../components/header/Header'
import tw from '../../../styles/tailwind'
import { canCancelContract, canOpenDispute } from '../../../utils/contract'
import { headerIcons } from '../../../utils/layout/headerIcons'

/* eslint max-params: ["error", 4]*/
export const getHeaderChatActions = (
  contract: Contract,
  showCancelOverlay: () => void,
  showOpenDisputeOverlay: () => void,
  view?: ContractViewer,
): HeaderConfig['icons'] => {
  if (contract?.disputeActive) return []

  const canCancel = canCancelContract(contract)
  const canDispute = canOpenDispute(contract, view)

  const openCancelTrade = canCancel ? showCancelOverlay : () => {}
  const raiseDispute = canDispute ? showOpenDisputeOverlay : () => {}

  const icons: HeaderConfig['icons'] = []
  if (!contract.paymentMade && !contract.canceled) {
    icons.push({
      ...headerIcons.cancel,
      style: !canCancel ? tw`opacity-50` : undefined,
      onPress: openCancelTrade,
    })
  }
  icons.push({
    ...headerIcons.warning,
    style: !canDispute ? tw`opacity-50` : undefined,
    onPress: raiseDispute,
  })
  return icons
}
