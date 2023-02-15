import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { MessageContext } from '../contexts/message'
import { useConfirmTradeCancelationOverlay } from '../overlays/tradeCancelation/useConfirmTradeCancelationOverlay'
import { useConfirmEscrowOverlay } from '../overlays/useConfirmEscrowOverlay'
import { useWronglyFundedOverlay } from '../overlays/useWronglyFundedOverlay'
import { getContract } from '../utils/contract'
import i18n from '../utils/i18n'
import { error, info } from '../utils/log'
import { getOffer } from '../utils/offer'
import { getContract as getContractAPI } from '../utils/peachAPI'
import { parseError } from '../utils/system'
import { useHandleContractNotifications } from './useHandleContractNotifications'
import { useNavigation } from './useNavigation'

// PN-A03
// contract.chat
// I’d say the notification icon is enough

const offerSummaryEvents = ['offer.notFunded', 'offer.sellOfferExpired', 'offer.buyOfferExpired']
const searchEvents = ['offer.matchBuyer', 'offer.matchSeller', 'offer.buyOfferImminentExpiry']

type PNData = {
  offerId?: string
  contractId: string
  isChat?: boolean
  type?: NotificationType
}

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>
export const useHandleNotifications = (getCurrentPage: () => keyof RootStackParamList | undefined) => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const confirmEscrowOverlay = useConfirmEscrowOverlay()
  const wronglyFundedOverlay = useWronglyFundedOverlay()
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()

  const overlayEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S03
      'offer.escrowFunded': ({ offerId }: PNData) =>
        offerId ? navigation.navigate('offerPublished', { offerId }) : null,
    }),
    [navigation],
  )

  const popupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S07
      'offer.fundingAmountDifferent': ({ offerId }: PNData) => {
        const sellOffer = offerId ? (getOffer(offerId) as SellOffer) : null

        if (!sellOffer) return
        confirmEscrowOverlay(sellOffer)
      },
      // PN-S08
      'offer.wrongFundingAmount': ({ offerId }: PNData) => {
        const sellOffer = offerId ? (getOffer(offerId) as SellOffer) : null

        if (!sellOffer) return
        wronglyFundedOverlay(sellOffer)
      },
      // PN-B08
      'contract.cancelationRequest': async ({ contractId }: PNData) => {
        const storedContract = contractId ? getContract(contractId) : null
        let [contract] = contractId ? await getContractAPI({ contractId }) : [null]
        if (contract && storedContract) contract = { ...contract, ...storedContract }

        if (!contract || contract.disputeActive) return
        showConfirmTradeCancelation(contract)
      },
    }),
    [confirmEscrowOverlay, showConfirmTradeCancelation, wronglyFundedOverlay],
  )
  const goToScreen = ({ type, contractId, isChat, offerId }: PNData): Action | undefined => {
    if (contractId && isChat) return {
      label: i18n('goToChat'),
      icon: 'arrowCircleLeft',
      callback: () => navigation.navigate('contractChat', { contractId }),
    }
    if (contractId) return {
      label: i18n('goToContract'),
      icon: 'arrowCircleLeft',
      callback: () => navigation.navigate('contract', { contractId }),
    }
    if (offerId && type && offerSummaryEvents.includes(type)) return {
      label: i18n('goToOffer'),
      icon: 'arrowCircleLeft',
      callback: () => navigation.navigate('offer', { offerId }),
    }
    if (offerId && type && searchEvents.includes(type)) return {
      label: i18n('goToOffer'),
      icon: 'arrowCircleLeft',
      callback: () => navigation.navigate('search', { offerId }),
    }
    return undefined
  }

  useHandleContractNotifications()

  const onMessageHandler = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> => {
      info('A new FCM message arrived! ' + JSON.stringify(remoteMessage), 'currentPage ' + getCurrentPage())
      if (!remoteMessage.data) return

      const data = remoteMessage.data as unknown as PNData
      const { type } = data
      if (!type) return

      if (overlayEvents[type]) {
        overlayEvents[type]?.(data)
      } else if (popupEvents[type]) {
        popupEvents[type]?.(data)
      } else {
        updateMessage({
          msgKey: 'notification.' + type,
          bodyArgs: remoteMessage.notification?.bodyLocArgs,
          level: 'APP',
          action: goToScreen(data),
        })
      }
    },
    [getCurrentPage, goToScreen, overlayEvents, popupEvents, updateMessage],
  )

  useEffect(() => {
    info('Subscribe to push notifications')
    try {
      const unsubscribe = messaging().onMessage(onMessageHandler)

      return unsubscribe
    } catch (e) {
      error('messaging().onMessage - Push notifications not supported', parseError(e))
      return () => {}
    }
  }, [onMessageHandler])
}
