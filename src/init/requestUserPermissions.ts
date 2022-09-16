import crashlytics from '@react-native-firebase/crashlytics'
import messaging from '@react-native-firebase/messaging'
import { account } from '../utils/account'
import { openAnalyticsPrompt, openCrashReportPrompt } from '../utils/analytics'
import { info } from '../utils/log'

export default async () => {
  info('Requesting notification permissions')
  const authStatus = await messaging().requestPermission({
    alert: true,
    badge: false,
    sound: true,
  })

  info('Permission status:', authStatus)

  if (typeof account.settings.enableAnalytics === 'undefined') openAnalyticsPrompt()

  // check if app has crashed and ask for permission to send crash report
  if (await await crashlytics().didCrashOnPreviousExecution()
    || await crashlytics().checkForUnsentReports()) openCrashReportPrompt()
}