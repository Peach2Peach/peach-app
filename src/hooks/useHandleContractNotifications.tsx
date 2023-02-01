import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useContext, useEffect } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { useDisputeRaisedNotice } from '../overlays/dispute/hooks/useDisputeRaisedNotice'
import { useDisputeResults } from '../overlays/dispute/hooks/useDisputeResults'
import { useShowPaymentReminder } from '../overlays/paymentTimer/useShowPaymentReminder'
import { useShowPaymentTimerExtended } from '../overlays/paymentTimer/useShowPaymentTimerExtended'
import { useShowPaymentTimerHasRunOut } from '../overlays/paymentTimer/useShowPaymentTimerHasRunOut'
import { useShowPaymentTimerSellerCanceled } from '../overlays/paymentTimer/useShowPaymentTimerSellerCanceled'
import { useBuyerCanceledOverlay } from '../overlays/tradeCancelation/useBuyerCanceledOverlay'
import { useBuyerRejectedCancelTradeOverlay } from '../overlays/tradeCancelation/useBuyerRejectedCancelTradeOverlay'
import { useConfirmTradeCancelationOverlay } from '../overlays/tradeCancelation/useConfirmTradeCancelationOverlay'
import { account } from '../utils/account'
import { getContract, getContractViewer } from '../utils/contract'
import { error, info } from '../utils/log'
import { getContract as getContractAPI } from '../utils/peachAPI'
import { parseError } from '../utils/system'
import { useNavigation } from './useNavigation'

const paymentReminders = ['contract.buyer.paymentReminderFourHours', 'contract.buyer.paymentReminderOneHour']

export const useHandleContractNotifications = (currentContractId?: string) => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const showDisputeRaisedNotice = useDisputeRaisedNotice()
  const showDisputeResults = useDisputeResults()

  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()
  const showBuyerCanceled = useBuyerCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  const showPaymentReminder = useShowPaymentReminder()
  const showPaymentTimerHasRunOut = useShowPaymentTimerHasRunOut()
  const showPaymentTimerSellerCanceled = useShowPaymentTimerSellerCanceled()
  const showPaymentTimerExtended = useShowPaymentTimerExtended()

  useEffect(() => {
    // eslint-disable-next-line max-statements
    const onMessageHandler = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<null | void> => {
      info('useHandleContractNotifications - A new FCM message arrived! ' + JSON.stringify(remoteMessage))
      if (!remoteMessage.data) return null

      const { contractId, message, reason, type } = remoteMessage.data
      const storedContract = contractId ? getContract(contractId) : null
      let [contract] = contractId ? await getContractAPI({ contractId }) : [null]
      if (contract && storedContract) contract = { ...contract, ...storedContract }

      if (!contract) return null

      if (type === 'contract.disputeRaised') return showDisputeRaisedNotice(contract, getContractViewer(contract, account))
      if (type === 'contract.disputeResolved') return showDisputeResults(contract, getContractViewer(contract, account))

      if (type === 'contract.canceled') return showBuyerCanceled(contract, false)
      if (type === 'contract.cancelationRequest' && !contract.disputeActive) {
        return showConfirmTradeCancelation(contract)
      }
      if (type === 'contract.cancelationRequestAccepted') {
        return showBuyerCanceled(contract, true)
      }
      if (type === 'contract.cancelationRequestRejected') {
        return showCancelTradeRequestRejected(contract)
      }
      if (paymentReminders.includes(type)) {
        return showPaymentReminder(contract, currentContractId === contractId)
      }
      if (type === 'contract.buyer.paymentTimerHasRunOut') {
        return showPaymentTimerHasRunOut(contract, 'buyer', currentContractId === contractId)
      }
      if (type === 'contract.buyer.paymentTimerSellerCanceled') {
        return showPaymentTimerSellerCanceled(contract, currentContractId === contractId)
      }
      if (type === 'contract.buyer.paymentTimerExtended') {
        return showPaymentTimerExtended(contract, currentContractId === contractId)
      }
      if (type === 'contract.seller.paymentTimerHasRunOut') {
        return showPaymentTimerHasRunOut(contract, 'seller', currentContractId === contractId)
      }
      return null
    }

    info('useHandleContractNotifications - Subscribe to push notifications')
    try {
      const unsubscribe = messaging().onMessage(onMessageHandler)

      return unsubscribe
    } catch (e) {
      error('useHandleContractNotifications - messaging().onMessage - Push notifications not supported', parseError(e))
      return () => {}
    }
  }, [])
}
