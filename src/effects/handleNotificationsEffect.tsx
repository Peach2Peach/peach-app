import messaging from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import React, { Dispatch, EffectCallback } from 'react'
import EscrowFunded from '../overlays/EscrowFunded'
import MatchAccepted from '../overlays/MatchAccepted'
import OfferExpired from '../overlays/OfferExpired'
import PaymentMade from '../overlays/PaymentMade'
import YouGotADispute from '../overlays/YouGotADispute'
import { info } from '../utils/log'
import { getOffer } from '../utils/offer'

type HandleNotificationsEffectProps = {
  getCurrentPage: () => keyof RootStackParamList,
  updateOverlay: Dispatch<OverlayState>,
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
}
export default ({
  getCurrentPage,
  updateOverlay,
  navigationRef,
}: HandleNotificationsEffectProps): EffectCallback => () => {
  info('Subscribe to push notifications')
  const unsubscribe = messaging().onMessage(async (remoteMessage): Promise<null|void> => {
    info('A new FCM message arrived! ' + JSON.stringify(remoteMessage), 'currentPage ' + getCurrentPage())
    if (remoteMessage.data && remoteMessage.data.type === 'offer.expired'
      && /buy|sell|home|settings|offers/u.test(getCurrentPage() as string)) {
      const offer = getOffer(remoteMessage.data.offerId) as SellOffer
      const args = remoteMessage.notification?.bodyLocArgs

      return updateOverlay({
        content: <OfferExpired offer={offer} days={args ? args[0] || '15' : '15'} navigation={navigationRef} />,
        showCloseButton: false
      })
    }
    if (remoteMessage.data && remoteMessage.data.type === 'offer.escrowFunded'
      && /buy|home|settings|offers/u.test(getCurrentPage() as string)) {
      return updateOverlay({
        content: <EscrowFunded offerId={remoteMessage.data.offerId} navigation={navigationRef} />,
        showCloseButton: false
      })
    }
    if (remoteMessage.data && remoteMessage.data.type === 'contract.contractCreated'
      && /buy|sell|home|settings|offers/u.test(getCurrentPage() as string)) {
      return updateOverlay({
        content: <MatchAccepted contractId={remoteMessage.data.contractId} navigation={navigationRef} />,
        showCloseButton: false
      })
    }
    if (remoteMessage.data && remoteMessage.data.type === 'contract.paymentMade'
      && /buy|sell|home|settings|offers/u.test(getCurrentPage() as string)) {
      return updateOverlay({
        content: <PaymentMade contractId={remoteMessage.data.contractId} navigation={navigationRef} />,
        showCloseButton: false
      })
    }
    if (remoteMessage.data && remoteMessage.data.type === 'contract.disputeRaised') {
      return updateOverlay({
        content: <YouGotADispute
          contractId={remoteMessage.data.contractId}
          message={remoteMessage.data.message}
          navigation={navigationRef} />,
        showCloseButton: false
      })
    }
    return null
  })

  return unsubscribe
}
