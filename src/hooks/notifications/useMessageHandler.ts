import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback, useContext } from 'react'
import { MessageContext } from '../../contexts/message'
import { info } from '../../utils/log'
import { useGetPNActionHandler } from './useGetPNActionHandler'
import { useOverlayEvents } from './eventHandler/useOverlayEvents'
import { useStateUpdateEvents } from './eventHandler/useStateUpdateEvents'
import { useOfferPopupEvents } from './eventHandler/offer/useOfferPopupEvents'
import { getContract as getContractAPI } from '../../utils/peachAPI'
import { useContractPopupEvents } from './eventHandler/contract/useContractPopupEvents'
import { getContract } from '../../utils/contract'
import { useAppState } from '../useAppState'

export const useMessageHandler = (getCurrentPage: () => keyof RootStackParamList | undefined) => {
  const [, updateMessage] = useContext(MessageContext)
  const getPNActionHandler = useGetPNActionHandler()
  const overlayEvents = useOverlayEvents()
  const offerPopupEvents = useOfferPopupEvents()
  const contractPopupEvents = useContractPopupEvents()
  const stateUpdateEvents = useStateUpdateEvents()
  const appState = useAppState()

  const onMessageHandler = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> => {
      info('A new FCM message arrived! ' + JSON.stringify(remoteMessage), 'currentPage ' + getCurrentPage())
      if (!remoteMessage.data) return

      const data = remoteMessage.data as unknown as PNData
      const { type } = data
      if (!type) return

      if (overlayEvents[type]) {
        overlayEvents[type]?.(data)
      } else if (offerPopupEvents[type]) {
        offerPopupEvents[type]?.(data, remoteMessage.notification)
      } else if (contractPopupEvents[type]) {
        const { contractId } = data
        if (!contractId) return
        const storedContract = getContract(contractId)
        let [contract] = await getContractAPI({ contractId })
        if (contract && storedContract) contract = { ...contract, ...storedContract }
        if (!contract) return
        contractPopupEvents[type]?.(contract)
      } else if (stateUpdateEvents[type]) {
        stateUpdateEvents[type]?.(data)
      } else if (appState === 'active') {
        updateMessage({
          msgKey: 'notification.' + type,
          bodyArgs: remoteMessage.notification?.bodyLocArgs,
          level: 'WARN',
          action: getPNActionHandler(data),
        })
      }
    },
    [
      appState,
      contractPopupEvents,
      getCurrentPage,
      getPNActionHandler,
      offerPopupEvents,
      overlayEvents,
      stateUpdateEvents,
      updateMessage,
    ],
  )
  return onMessageHandler
}
