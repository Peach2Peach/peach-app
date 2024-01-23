import NotificationBadge from '@msml/react-native-notification-badge'
import messaging from '@react-native-firebase/messaging'
import { AppRegistry, LogBox } from 'react-native'
import './shim.js'
import { App } from './src/App.js'
import { name as appName } from './src/app.json'
import { error } from './src/utils/log/error.js'
import { info } from './src/utils/log/info.js'
import { updateUser } from './src/utils/peachAPI/updateUser.js'
import { parseError } from './src/utils/result/parseError.js'
import { isIOS } from './src/utils/system/isIOS.js'
import { isProduction } from './src/utils/system/isProduction.js'
import { useNotificationStore } from './src/views/home/notificationsStore.js'

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
