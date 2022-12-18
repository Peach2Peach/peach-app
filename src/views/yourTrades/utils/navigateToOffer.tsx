import React from 'react'
import Refund from '../../../overlays/Refund'
import { getContract } from '../../../utils/contract'
import { StackNavigation } from '../../../utils/navigation'
import { getNavigationDestination } from './getNavigationDestination'
import { shouldUpdateOverlay } from './shouldUpdateOverlay'

export const navigateToOffer = (
  offer: SellOffer | BuyOffer,
  offerStatus: TradeStatus,
  navigation: StackNavigation,
  updateOverlay: React.Dispatch<OverlayState>,
  // eslint-disable-next-line max-params
): void => {
  const contract = offer.contractId ? getContract(offer.contractId) : null
  const navigationDestination = getNavigationDestination(offer, offerStatus, contract)
  if (shouldUpdateOverlay(offer, offerStatus, contract)) {
    updateOverlay({
      content: <Refund {...{ sellOffer: offer, navigation }} />,
      showCloseButton: false,
    })
  }
  return navigation.navigate(...navigationDestination)
}
