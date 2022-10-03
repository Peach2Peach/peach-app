import crashlytics from '@react-native-firebase/crashlytics'
import messaging from '@react-native-firebase/messaging'
import { openCrashReportPrompt } from '../utils/analytics'
import { error, info } from '../utils/log'
import { parseError } from '../utils/system'

export default async () => {
  info('Requesting notification permissions')

  try {
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: false,
      sound: true
    })
    info('Permission status:', authStatus)
  } catch (e) {
    error('messaging().requestPermission - Push notifications not supported', parseError(e))
  }

  // check if app has crashed and ask for permission to send crash report
  if (await await crashlytics().didCrashOnPreviousExecution()) openCrashReportPrompt([])
}
