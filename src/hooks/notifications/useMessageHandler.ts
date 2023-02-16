import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback, useContext } from 'react'
import { MessageContext } from '../../contexts/message'
import { info } from '../../utils/log'
import { useGetPNActionHandler } from '../useGetPNActionHandler'
import { useOverlayEvents } from './global/useOverlayEvents'
import { usePopupEvents } from './global/usePopupEvents'
import { useStateUpdateEvents } from './global/useStateUpdateEvents'

export const useMessageHandler = (getCurrentPage: () => keyof RootStackParamList | undefined) => {
  const [, updateMessage] = useContext(MessageContext)
  const getPNActionHandler = useGetPNActionHandler()
  const overlayEvents = useOverlayEvents()
  const popupEvents = usePopupEvents()
  const stateUpdateEvents = useStateUpdateEvents()

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
      } else if (stateUpdateEvents[type]) {
        stateUpdateEvents[type]?.(data)
      } else {
        updateMessage({
          msgKey: 'notification.' + type,
          bodyArgs: remoteMessage.notification?.bodyLocArgs,
          level: 'DEFAULT',
          action: getPNActionHandler(data),
        })
      }
    },
    [getCurrentPage, getPNActionHandler, overlayEvents, popupEvents, stateUpdateEvents, updateMessage],
  )
  return onMessageHandler
}
