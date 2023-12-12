import NotificationBadge from '@msml/react-native-notification-badge'
import messaging from '@react-native-firebase/messaging'
import { AppRegistry, LogBox } from 'react-native'
import { App } from './App'
import { name as appName } from './app.json'
import { error, info } from './utils/log'
import { updateUser } from './utils/peachAPI'
import { parseError } from './utils/result/parseError'
import { isIOS, isProduction } from './utils/system'
import { useNotificationStore } from './views/home/notificationsStore'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  // eslint-disable-next-line max-len
  /ViewPropTypes will be removed from React Native./u,
  /RCTBridge required dispatch_sync/u,
  /Can't perform a React state update on an unmounted component/u,
  /Require cycle/u,
  // Webview (shadows)
  /Did not receive response to shouldStartLoad in time/u,
  /startLoadWithResult invoked with invalid lockIdentifier/u,
  /ERROR/u,
])

LogBox.ignoreAllLogs(isProduction())

try {
  // eslint-disable-next-line require-await
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const notifs = useNotificationStore.getState().notifications + 1

    if (isIOS()) NotificationBadge.setNumber(notifs)
    useNotificationStore.getState().setNotifications(notifs)

    info('Message handled in the background!', remoteMessage)
  })
  messaging().onTokenRefresh((fcmToken) => updateUser({ fcmToken }))
} catch (e) {
  error('messaging().setBackgroundMessageHandler/onTokenRefresh - Push notifications not supported', parseError(e))
}

AppRegistry.registerComponent(appName, () => App)

if (typeof document !== 'undefined') {
  // start webapp if document available
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
}

export default () => {}
