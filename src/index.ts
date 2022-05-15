/**
 * @format
 */

import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import { isWeb } from './utils/system'
import * as db from './utils/db'
import { setFCMToken } from './utils/peachAPI'
import messaging from '@react-native-firebase/messaging'
import { info } from './utils/log'
import App from './App'

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