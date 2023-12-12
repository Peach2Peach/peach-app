import messaging from '@react-native-firebase/messaging'
import { isAirplaneModeSync } from 'react-native-device-info'
import { openCrashReportPrompt } from '../utils/analytics/openCrashReportPrompt'
import { deleteFile, exists, readFile } from '../utils/file'
import { error, info } from '../utils/log'
import { parseError } from '../utils/result/parseError'

export const requestUserPermissions = async () => {
  info('Requesting notification permissions')

  try {
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: false,
      sound: true,
    })
    info('Permission status:', authStatus)
  } catch (e) {
    error('messaging().requestPermission - Push notifications not supported', parseError(e))
  }

  // check if there are errors in queue to be sent
  if (!isAirplaneModeSync() && (await exists('/error.log'))) {
    const errorQueue = await readFile('/error.log')
    openCrashReportPrompt(errorQueue.split('\n').map((e: string) => new Error(e)))
    deleteFile('/error.log')
  }
}
