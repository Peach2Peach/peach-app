/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native'
import { name as appName } from './app.json'
import { isWeb } from './utils/system'
import * as db from './utils/db'
import { setFCMToken } from './utils/peachAPI'
import messaging from '@react-native-firebase/messaging'
import { info } from './utils/log'
import App from './App'

// TODO check if these messages have a fix
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  // eslint-disable-next-line max-len
  '[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!',
  /ViewPropTypes will be removed from React Native./u,
  /RCTBridge required dispatch_sync/u,
  /Can't perform a React state update on an unmounted component/u,
  /Require cycle/u,
])

messaging().setBackgroundMessageHandler(async remoteMessage => {
  info('Message handled in the background!', remoteMessage)
})

messaging().onTokenRefresh(setFCMToken)


AppRegistry.registerComponent(appName, () => App)

if (typeof document !== 'undefined') {
  // start webapp if document available
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root')
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
}

const init = async () => {
  if (isWeb()) await db.init(process.env.NODE_ENV !== 'production')
}

init()

export default () => {}