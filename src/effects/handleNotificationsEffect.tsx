import messaging from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import React, { Dispatch, EffectCallback } from 'react'
import { DisputeResult } from '../overlays/DisputeResult'
import EscrowFunded from '../overlays/EscrowFunded'
import MatchAccepted from '../overlays/MatchAccepted'
import OfferExpired from '../overlays/OfferExpired'
import OfferNotFunded from '../overlays/OfferNotFunded'
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
    if (!remoteMessage.data) return null

    const type = remoteMessage.data?.type
    const args = remoteMessage.notification?.bodyLocArgs

    if (type === 'offer.expired'
      && !/contract/u.test(getCurrentPage() as string)) {
      const offer = getOffer(remoteMessage.data.offerId) as SellOffer

      return updateOverlay({
        content: <OfferExpired offer={offer} days={args ? args[0] || '15' : '15'} navigation={navigationRef} />,
      })
    }
    if (type === 'offer.notFunded'
      && !/sell|contract/u.test(getCurrentPage() as string)) {
      const offer = getOffer(remoteMessage.data.offerId) as SellOffer

      return updateOverlay({
        content: <OfferNotFunded offer={offer} days={args ? args[0] || '7' : '7'} navigation={navigationRef} />,
      })
    }
    if (type === 'offer.escrowFunded'
      && !/sell|contract/u.test(getCurrentPage() as string)) {
      return updateOverlay({
        content: <EscrowFunded offerId={remoteMessage.data.offerId} navigation={navigationRef} />,
      })
    }
    if (type === 'contract.contractCreated'
      && !/contract/u.test(getCurrentPage() as string)) {
      return updateOverlay({
        content: <MatchAccepted contractId={remoteMessage.data.contractId} navigation={navigationRef} />,
      })
    }
    if (type === 'contract.paymentMade'
      && !/contract/u.test(getCurrentPage() as string)) {
      return updateOverlay({
        content: <PaymentMade contractId={remoteMessage.data.contractId} navigation={navigationRef} />,
      })
    }
    if (type === 'contract.disputeRaised') {
      return updateOverlay({
        content: <YouGotADispute
          contractId={remoteMessage.data.contractId}
          message={remoteMessage.data.message}
          reason={remoteMessage.data.reason as DisputeReason}
          navigation={navigationRef} />,
      })
    }
    if (type === 'contract.disputeResolved') {
      return updateOverlay({
        content: <DisputeResult
          contractId={remoteMessage.data.contractId}
          navigation={navigationRef} />,
      })
    }
    return null
  })

  return unsubscribe
}
