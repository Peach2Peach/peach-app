import crashlytics from '@react-native-firebase/crashlytics'
import { Alert } from 'react-native'
import { openCrashReportPrompt } from '../analytics/openCrashReportPrompt'
import { isNetworkError } from '../system/isNetworkError'
import { isProduction } from '../system/isProduction'

export const error = (...args: any[]) => {
  const message = [new Date(), 'ERROR', ...args].join(' - ')
  if (isProduction()) {
    crashlytics().log(message)
    const errors = args.filter((arg) => arg instanceof Error).filter((arg) => !isNetworkError(arg.message))

    if (errors.length) openCrashReportPrompt(errors)
  } else {
    const errors = args.filter((arg) => arg instanceof Error).filter((arg) => !isNetworkError(arg.message))

    if (errors.length) Alert.alert('Error', errors.map((err) => err.message).join('\n\n'))
    console.error(message)
  }
}
