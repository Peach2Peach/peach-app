import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback, useContext, useMemo } from 'react'
import { MessageContext } from '../contexts/message'
import { useConfirmTradeCancelationOverlay } from '../overlays/tradeCancelation/useConfirmTradeCancelationOverlay'
import { useConfirmEscrowOverlay } from '../overlays/useConfirmEscrowOverlay'
import { useWronglyFundedOverlay } from '../overlays/useWronglyFundedOverlay'
import { getContract } from '../utils/contract'
import { info } from '../utils/log'
import { getOffer } from '../utils/offer'
import { getContract as getContractAPI } from '../utils/peachAPI'
import { useGetPNActionHandler } from './useGetPNActionHandler'
import { useNavigation } from './useNavigation'

type PNEventHandlers = Partial<Record<NotificationType, (data: PNData) => void>>

const useOverLayEvents = () => {
  const navigation = useNavigation()

  const overlayEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-S03
      'offer.escrowFunded': ({ offerId }: PNData) =>
        offerId ? navigation.navigate('offerPublished', { offerId, shouldGoBack: true }) : null,
    }),
    [navigation],
  )
  return overlayEvents
}
const usePopupEvents = () => {
  const confirmEscrowOverlay = useConfirmEscrowOverlay()
  const wronglyFundedOverlay = useWronglyFundedOverlay()
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()

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
  return popupEvents
}
export const useMessageHandler = (getCurrentPage: () => keyof RootStackParamList | undefined) => {
  const [, updateMessage] = useContext(MessageContext)
  const getPNActionHandler = useGetPNActionHandler()
  const overlayEvents = useOverLayEvents()
  const popupEvents = usePopupEvents()

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
          level: 'DEFAULT',
          action: getPNActionHandler(data),
        })
      }
    },
    [getCurrentPage, getPNActionHandler, overlayEvents, popupEvents, updateMessage],
  )
  return onMessageHandler
}
