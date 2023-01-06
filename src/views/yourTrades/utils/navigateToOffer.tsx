import React from 'react'
import Refund from '../../../overlays/Refund'
import { getContract } from '../../../utils/contract'
import { StackNavigation } from '../../../utils/navigation'
import { getNavigationDestination } from './getNavigationDestination'
import { shouldOpenRefundOverlay } from './shouldOpenRefundOverlay'

type NavigateToOfferProps = {
  offer: SellOffer | BuyOffer
  navigation: StackNavigation
  updateOverlay: React.Dispatch<OverlayState>
  matchStoreSetOffer: (offer: BuyOffer | SellOffer) => void
}

export const navigateToOffer = ({
  offer,
  navigation,
  updateOverlay,
  matchStoreSetOffer,
}: NavigateToOfferProps): void => {
  const contract = offer.contractId ? getContract(offer.contractId) : undefined
  const [screen, params] = getNavigationDestination(offer, contract)
  if (shouldOpenRefundOverlay(offer, contract)) {
    updateOverlay({
      content: <Refund {...{ sellOffer: offer, navigation }} />,
      visible: true,
    })
  }
  if (screen === 'search') {
    matchStoreSetOffer(offer)
  }

  return navigation.navigate(screen, params)
}
