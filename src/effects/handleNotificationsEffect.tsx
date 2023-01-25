import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
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
import { Navigation } from '../utils/navigation'

type HandleNotificationsEffectProps = {
  getCurrentPage: () => keyof RootStackParamList
  updateOverlay: Dispatch<OverlayState>
  navigation: Navigation
}

export default ({ getCurrentPage, updateOverlay, navigation }: HandleNotificationsEffectProps): EffectCallback =>
  () => {
    // eslint-disable-next-line max-statements, complexity
    const onMessageHandler = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<null | void> => {
      info('A new FCM message arrived! ' + JSON.stringify(remoteMessage), 'currentPage ' + getCurrentPage())
      if (!remoteMessage.data) return null

      const type = remoteMessage.data?.type
      const args = remoteMessage.notification?.bodyLocArgs
      const currentPage = getCurrentPage() as string
      const offer = remoteMessage.data?.offerId ? (getOffer(remoteMessage.data.offerId) as SellOffer) : null
      let contract = remoteMessage.data.contractId ? getContract(remoteMessage.data.contractId) : null

      if (offer && type === 'offer.expired' && !/contract/u.test(currentPage)) {
        const days = args ? args[0] || '15' : '15'
        return updateOverlay({
          content: <OfferExpired {...{ offer, days, navigation }} />,
        })
      }
      if (offer && type === 'offer.notFunded' && !/sell|contract/u.test(currentPage)) {
        const days = args ? args[0] || '7' : '7'
        return updateOverlay({
          content: <OfferNotFunded {...{ offer, days, navigation }} />,
        })
      }
      if (type === 'offer.escrowFunded' && !/sell|contract/u.test(currentPage)) {
        return updateOverlay({
          content: <EscrowFunded {...{ offerId: remoteMessage.data?.offerId, navigation }} />,
        })
      }

      if (type === 'contract.contractCreated' && !/contract|search/u.test(currentPage)) {
        return updateOverlay({
          content: <MatchAccepted {...{ contractId: remoteMessage.data.contractId }} />,
        })
      }
      if (contract && type === 'contract.paymentMade' && !/contract/u.test(currentPage)) {
        const date = remoteMessage.sentTime || Date.now()
        return updateOverlay({
          content: <PaymentMade {...{ contract, date, navigation }} />,
        })
      }
      if (type === 'contract.disputeRaised') {
        const { contractId, message, reason } = remoteMessage.data
        return updateOverlay({
          content: <YouGotADispute {...{ contractId, message, reason: reason as DisputeReason, navigation }} />,
        })
      }
      if (type === 'contract.disputeResolved') {
        const { contractId } = remoteMessage.data

        return updateOverlay({
          content: <DisputeResult {...{ contractId, navigation }} />,
        })
      }

      if (contract && type === 'contract.canceled') {
        const [result] = await getContractAPI({ contractId: contract.id })
        if (result) contract = { ...result, ...contract }
        return updateOverlay({
          content: <BuyerCanceledTrade {...{ contract, navigation }} />,
        })
      }
      if (contract && type === 'contract.cancelationRequest' && !contract.disputeActive) {
        return updateOverlay({
          content: <ConfirmCancelTradeRequest {...{ contract, navigation }} />,
        })
      }
      if (contract && type === 'contract.cancelationRequestAccepted') {
        return updateOverlay({
          content: <CancelTradeRequestConfirmed {...{ contract, navigation }} />,
        })
      }
      if (contract && type === 'contract.cancelationRequestRejected') {
        return updateOverlay({
          content: <CancelTradeRequestRejected {...{ contract, navigation }} />,
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
