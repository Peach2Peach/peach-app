import React from 'react'
import Refund from '../../../overlays/Refund'
import { StackNavigation } from '../../../utils/navigation/handlePushNotification'
import { getOffer } from '../../../utils/offer'
import { getNavigationDestinationForContract } from './getNavigationDestination'
import { shouldOpenOverlay } from './shouldOpenOverlay'

type NavigateToContractProps = {
  contract: ContractSummary
  navigation: StackNavigation
  updateOverlay: React.Dispatch<OverlayState>
}

export const navigateToContract = ({ contract, navigation, updateOverlay }: NavigateToContractProps): void => {
  const [screen, params] = getNavigationDestinationForContract(contract)
  if (shouldOpenOverlay(contract.tradeStatus)) {
    const sellOffer = getOffer(contract.offerId) as SellOffer
    if (sellOffer) updateOverlay({
      content: <Refund {...{ sellOffer, navigation }} />,
      visible: true,
    })
  }

  return navigation.navigate(screen, params)
}
