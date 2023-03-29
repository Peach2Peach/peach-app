import { Dispatch } from 'react'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import SplashScreen from 'react-native-splash-screen'
import { account } from '../utils/account'
import { error, info } from '../utils/log'
import { handlePushNotification } from '../utils/navigation'
import { sleep } from '../utils/performance'
import { parseError } from '../utils/system'

/**
 * @description Method to wait up to 10 seconds for navigation to initialise.
 */
const waitForNavigation = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: Dispatch<MessageState>,
) => {
  let waitForNavCounter = 100
  while (!navigationRef.isReady()) {
    if (waitForNavCounter === 0) {
      updateMessage({ msgKey: 'NAVIGATION_INIT_ERROR', level: 'ERROR' })
      throw new Error('Failed to initialize navigation')
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(100)
    waitForNavCounter--
  }
}

const dataIsDefined = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & {
  data: {
    [key: string]: string
  }
} => !!remoteMessage.data

/**
 * @description Method to init navigation and check where to navigate to first after opening the app
 */
export const initialNavigation = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: Dispatch<MessageState>,
) => {
  await waitForNavigation(navigationRef, updateMessage)

  let initialNotification: FirebaseMessagingTypes.RemoteMessage | null = null
  try {
    initialNotification = await messaging().getInitialNotification()
  } catch (e) {
    error('messaging().getInitialNotification - Push notifications not supported', parseError(e))
  }

  if (initialNotification) {
    info('Notification caused app to open from quit state:', JSON.stringify(initialNotification))

    if (dataIsDefined(initialNotification)) {
      const handledNotification = await handlePushNotification(navigationRef, initialNotification)
      if (!handledNotification) {
        navigationRef.navigate(account?.publicKey ? 'home' : 'welcome')
      }
    }
  }

  messaging().onNotificationOpenedApp((remoteMessage) => {
    info('Notification caused app to open from background state:', JSON.stringify(remoteMessage))

    if (dataIsDefined(remoteMessage)) handlePushNotification(navigationRef, remoteMessage)
  })

  SplashScreen.hide()
}
