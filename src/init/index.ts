import NotificationBadge from '@msml/react-native-notification-badge'
import messaging from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { dataMigration } from '../init/dataMigration'
import events from '../init/events'
import requestUserPermissions from '../init/requestUserPermissions'
import session, { getPeachInfo, getTrades } from '../init/session'
import userUpdate from '../init/userUpdate'
import { account } from '../utils/account'
import { exists } from '../utils/file'
import i18n from '../utils/i18n'
import { error, info } from '../utils/log'
import { handlePushNotification } from '../utils/navigation'
import { sleep } from '../utils/performance'
import { getSession, setSession } from '../utils/session'
import { isIOS } from '../utils/system'


const initialNavigation = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: React.Dispatch<MessageState>,
  sessionInitiated: boolean,
) => {
  let waitForNavCounter = 100
  while (!navigationRef.isReady()) {
    if (waitForNavCounter === 0) {
      updateMessage({ msg: i18n('NAVIGATION_INIT_ERROR'), level: 'ERROR' })
      throw new Error('Failed to initialize navigation')
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(100)
    waitForNavCounter--
  }
  const initialNotification = await messaging().getInitialNotification()

  if (!sessionInitiated && (await exists('/peach-account.json') || await exists('/peach-account-identity.json'))) {
    navigationRef.navigate('login', {})
  } else if (initialNotification) {
    info('Notification caused app to open from quit state:', JSON.stringify(initialNotification))

    let notifications = Number(getSession().notifications || 0)
    if (notifications > 0) notifications -= 1
    if (isIOS()) NotificationBadge.setNumber(notifications)
    setSession({ notifications })

    if (initialNotification.data) handlePushNotification(
      navigationRef,
      initialNotification.data,
      initialNotification.sentTime
    )
  } else if (navigationRef.getCurrentRoute()?.name === 'splashScreen') {
    navigationRef.reset({
      index: 0,
      routes: [{ name: account?.publicKey ? 'home' : 'welcome' }],
    })
  }

  messaging().onNotificationOpenedApp(remoteMessage => {
    info('Notification caused app to open from background state:', JSON.stringify(remoteMessage))

    let notifications = Number(getSession().notifications || 0)
    if (notifications > 0) notifications -= 1
    if (isIOS()) NotificationBadge.setNumber(notifications)
    setSession({ notifications })

    if (remoteMessage.data) handlePushNotification(navigationRef, remoteMessage.data, remoteMessage.sentTime)
  })
}

/**
 * @description Method to initialize app by retrieving app session and user account
 * @param navigationRef reference to navigation
 */
export const initApp = async (
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  updateMessage: React.Dispatch<MessageState>,
): Promise<void> => {
  const timeout = setTimeout(() => {
    // go home anyway after 30 seconds
    error(new Error('STARTUP_ERROR'))
    initialNavigation(navigationRef, updateMessage, !!account?.publicKey)
  }, 30000)

  events()
  const sessionInitiated = await session()

  await getPeachInfo(account)
  if (account?.publicKey) {
    getTrades()
    userUpdate()
    dataMigration()
  }

  clearTimeout(timeout)
  initialNavigation(navigationRef, updateMessage, sessionInitiated)
  await requestUserPermissions()
}