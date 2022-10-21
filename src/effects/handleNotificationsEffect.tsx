/* eslint-disable max-lines-per-function */
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import React, { Dispatch, EffectCallback } from 'react'
import { DisputeResult } from '../overlays/DisputeResult'
import EscrowFunded from '../overlays/EscrowFunded'
import MatchAccepted from '../overlays/MatchAccepted'
import OfferExpired from '../overlays/OfferExpired'
import OfferNotFunded from '../overlays/OfferNotFunded'
import PaymentMade from '../overlays/PaymentMade'
import { BuyerCanceledTrade } from '../overlays/tradeCancelation/BuyerCanceledTrade'
import { CancelTradeRequestConfirmed } from '../overlays/tradeCancelation/CancelTradeRequestConfirmed'
import { CancelTradeRequestRejected } from '../overlays/tradeCancelation/CancelTradeRequestRejected'
import { ConfirmCancelTradeRequest } from '../overlays/tradeCancelation/ConfirmCancelTradeRequest'
import YouGotADispute from '../overlays/YouGotADispute'
import { getContract } from '../utils/contract'
import { getContract as getContractAPI } from '../utils/peachAPI'
import { error, info } from '../utils/log'
import { getOffer } from '../utils/offer'
import { parseError } from '../utils/system'

type HandleNotificationsEffectProps = {
  getCurrentPage: () => keyof RootStackParamList
  updateOverlay: Dispatch<OverlayState>
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>
}

export default ({ getCurrentPage, updateOverlay, navigationRef }: HandleNotificationsEffectProps): EffectCallback =>
  () => {
    // eslint-disable-next-line max-statements, complexity
    const onMessageHandler = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<null | void> => {
      info('A new FCM message arrived! ' + JSON.stringify(remoteMessage), 'currentPage ' + getCurrentPage())
      if (!remoteMessage.data) return null

      const type = remoteMessage.data?.type
      const args = remoteMessage.notification?.bodyLocArgs
      const currentPage = getCurrentPage() as string
      const offer = remoteMessage.data.offerId ? (getOffer(remoteMessage.data.offerId) as SellOffer) : null
      let contract = remoteMessage.data.contractId ? getContract(remoteMessage.data.contractId) : null

      if (offer && type === 'offer.expired' && !/contract/u.test(currentPage)) {
        return updateOverlay({
          content: (
            <OfferExpired offer={offer as SellOffer} days={args ? args[0] || '15' : '15'} navigation={navigationRef} />
          ),
        })
      }
      if (offer && type === 'offer.notFunded' && !/sell|contract/u.test(currentPage)) {
        return updateOverlay({
          content: (
            <OfferNotFunded offer={offer as SellOffer} days={args ? args[0] || '7' : '7'} navigation={navigationRef} />
          ),
        })
      }
      if (type === 'offer.escrowFunded' && !/sell|contract/u.test(currentPage)) {
        return updateOverlay({
          content: <EscrowFunded offerId={remoteMessage.data.offerId} navigation={navigationRef} />,
        })
      }

      if (type === 'contract.contractCreated' && !/contract|search/u.test(currentPage)) {
        return updateOverlay({
          content: <MatchAccepted contractId={remoteMessage.data.contractId} navigation={navigationRef} />,
        })
      }
      if (type === 'contract.paymentMade' && !/contract/u.test(currentPage)) {
        return updateOverlay({
          content: (
            <PaymentMade
              contractId={remoteMessage.data.contractId}
              date={remoteMessage.sentTime || new Date().getTime()}
              navigation={navigationRef}
            />
          ),
        })
      }
      if (type === 'contract.disputeRaised') {
        return updateOverlay({
          content: (
            <YouGotADispute
              contractId={remoteMessage.data.contractId}
              message={remoteMessage.data.message}
              reason={remoteMessage.data.reason as DisputeReason}
              navigation={navigationRef}
            />
          ),
        })
      }
      if (type === 'contract.disputeResolved') {
        return updateOverlay({
          content: <DisputeResult contractId={remoteMessage.data.contractId} navigation={navigationRef} />,
        })
      }

      if (contract && type === 'contract.canceled') {
        const [result] = await getContractAPI({ contractId: contract.id })
        if (result) contract = { ...result, ...contract }
        return updateOverlay({
          content: <BuyerCanceledTrade contract={contract!} navigation={navigationRef} />,
        })
      }
      if (contract && type === 'contract.cancelationRequest') {
        return updateOverlay({
          content: <ConfirmCancelTradeRequest contract={contract} navigation={navigationRef} />,
        })
      }
      if (contract && type === 'contract.cancelationRequestAccepted') {
        return updateOverlay({
          content: <CancelTradeRequestConfirmed contract={contract} navigation={navigationRef} />,
        })
      }
      if (contract && type === 'contract.cancelationRequestRejected') {
        return updateOverlay({
          content: <CancelTradeRequestRejected contract={contract} navigation={navigationRef} />,
        })
      }
      return null
    }

    info('Subscribe to push notifications')
    try {
      const unsubscribe = messaging().onMessage(onMessageHandler)

      return unsubscribe
    } catch (e) {
      error('messaging().onMessage - Push notifications not supported', parseError(e))
      return () => {}
    }
  }
