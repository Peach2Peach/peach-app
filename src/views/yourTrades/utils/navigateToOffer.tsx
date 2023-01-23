import React from 'react'
import Refund from '../../../overlays/Refund'
import { StackNavigation } from '../../../utils/navigation/handlePushNotification'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForOffer } from './getNavigationDestination'
import { shouldOpenRefundOverlay } from './shouldOpenRefundOverlay'

type NavigateToOfferProps = {
  offer: OfferSummary
  navigation: StackNavigation
  updateOverlay: React.Dispatch<OverlayState>
  matchStoreSetOffer: (offer: BuyOffer | SellOffer) => void
}

export const navigateToOffer = async ({
  offer,
  navigation,
  updateOverlay,
  matchStoreSetOffer,
}: NavigateToOfferProps) => {
  const [screen, params] = getNavigationDestinationForOffer(offer)
  if (shouldOpenRefundOverlay(offer.tradeStatus)) {
    const [sellOffer] = await getOfferDetails({ offerId: offer.id })
    if (sellOffer && isSellOffer(sellOffer)) updateOverlay({
      content: <Refund {...{ sellOffer, navigation }} />,
      visible: true,
    })
  }
  if (screen === 'search') {
    const [offr] = await getOfferDetails({ offerId: offer.id })
    if (offr) matchStoreSetOffer(offr)
  }

  return navigation.replace(screen, params)
}
