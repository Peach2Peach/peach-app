import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'
import { HeaderConfig } from '../../../components/header/store'
import { canCancelContract, canOpenDispute } from '../../../utils/contract'

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
  // const extendTime = () => alert('todo extend time')
  const raiseDispute = canDispute ? showOpenDisputeOverlay : () => {}

  const icons: HeaderConfig['icons'] = []
  if (!contract.paymentMade && !contract.canceled) {
    icons.push({
      iconComponent: <Icon style={!canCancel && tw`opacity-50`} id="xCircle" color={tw`text-error-main`.color} />,
      onPress: openCancelTrade,
    })
  }
  icons.push({
    iconComponent: <Icon style={!canDispute && tw`opacity-50`} id="alertOctagon" color={tw`text-warning-main`.color} />,
    onPress: raiseDispute,
  })
  return icons
}
