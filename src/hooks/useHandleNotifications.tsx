import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import React, { useContext, useEffect } from 'react'
import { OverlayContext } from '../contexts/overlay'
import EscrowFunded from '../overlays/EscrowFunded'
import MatchAccepted from '../overlays/MatchAccepted'
import OfferExpired from '../overlays/OfferExpired'
import OfferNotFunded from '../overlays/OfferNotFunded'
import PaymentMade from '../overlays/PaymentMade'
import { useBuyerCanceledOverlay } from '../overlays/tradeCancelation/useBuyerCanceledOverlay'
import { useBuyerRejectedCancelTradeOverlay } from '../overlays/tradeCancelation/useBuyerRejectedCancelTradeOverlay'
import { useConfirmTradeCancelationOverlay } from '../overlays/tradeCancelation/useConfirmTradeCancelationOverlay'
// import { BuyerCanceledTrade } from '../overlays/tradeCancelation/BuyerCanceledTrade'
// import { CancelTradeRequestConfirmed } from '../overlays/tradeCancelation/CancelTradeRequestConfirmed'
// import { BuyerRejectedCancelTrade } from '../overlays/tradeCancelation/BuyerRejectedCancelTrade'
// import { ConfirmCancelTradeRequest } from '../overlays/tradeCancelation/ConfirmCancelTradeRequest'
import { getContract } from '../utils/contract'
import { error, info } from '../utils/log'
import { getOffer } from '../utils/offer'
import { getContract as getContractAPI } from '../utils/peachAPI'
import { parseError } from '../utils/system'
import { useNavigation } from './useNavigation'

export const useHandleNotifications = (getCurrentPage: () => keyof RootStackParamList | undefined) => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()
  const showBuyerCanceled = useBuyerCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  useEffect(() => {
    // eslint-disable-next-line max-statements, complexity
    const onMessageHandler = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<null | void> => {
      info('A new FCM message arrived! ' + JSON.stringify(remoteMessage), 'currentPage ' + getCurrentPage())
      if (!remoteMessage.data) return null

      const { offerId, contractId } = remoteMessage.data
      const type = remoteMessage.data?.type
      const args = remoteMessage.notification?.bodyLocArgs
      const currentPage = getCurrentPage() as string
      const offer = offerId ? (getOffer(offerId) as SellOffer) : null
      const storedContract = contractId ? getContract(contractId) : null
      let [contract] = contractId ? await getContractAPI({ contractId }) : [null]
      if (contract && storedContract) contract = { ...contract, ...storedContract }

      if (offer && type === 'offer.expired' && !/contract/u.test(currentPage)) {
        const days = args ? args[0] || '15' : '15'
        return updateOverlay({
          content: <OfferExpired {...{ offer, days, navigation }} />,
          visible: true,
        })
      }
      if (offer && type === 'offer.notFunded' && !/sell|contract/u.test(currentPage)) {
        const days = args ? args[0] || '7' : '7'
        return updateOverlay({
          content: <OfferNotFunded {...{ offer, days, navigation }} />,
          visible: true,
        })
      }
      if (type === 'offer.escrowFunded' && !/sell|contract/u.test(currentPage)) {
        return updateOverlay({
          content: <EscrowFunded {...{ offerId, navigation }} />,
          visible: true,
        })
      }

      if (type === 'contract.contractCreated' && !/contract|search/u.test(currentPage)) {
        return updateOverlay({
          content: <MatchAccepted {...{ contractId }} />,
          visible: true,
        })
      }
      if (contract && type === 'contract.paymentMade' && !/contract/u.test(currentPage)) {
        return navigation.navigate('paymentMade', { contractId: contract.id })
      }
      if (type === 'contract.disputeRaised') {
        // const { contractId, message, reason } = remoteMessage.data
        // return updateOverlay({
        //   content: <YouGotADispute {...{ contractId, message, reason: reason as DisputeReason, navigation }} />,
        //   visible: true,
        // })
      }
      if (type === 'contract.disputeResolved') {
        // return updateOverlay({
        //   content: <DisputeResult {...{ contractId, navigation }} />,
        //   visible: true,
        // })
      }

      if (contract) {
        if (type === 'contract.canceled') return showBuyerCanceled(contract, false)
        if (type === 'contract.cancelationRequest' && !contract.disputeActive) {
          return showConfirmTradeCancelation(contract)
        }
        if (type === 'contract.cancelationRequestAccepted') return showBuyerCanceled(contract, true)
        if (type === 'contract.cancelationRequestRejected') return showCancelTradeRequestRejected(contract)
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
  }, [
    getCurrentPage,
    navigation,
    showBuyerCanceled,
    showCancelTradeRequestRejected,
    showConfirmTradeCancelation,
    updateOverlay,
  ])
}
