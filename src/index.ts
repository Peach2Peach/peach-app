/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { isWeb } from './utils/systemUtils'
import * as db from './utils/db'

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