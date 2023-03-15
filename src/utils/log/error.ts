import crashlytics from '@react-native-firebase/crashlytics'
import { openCrashReportPrompt } from '../analytics'
import { isNetworkError, isProduction } from '../system'

export const error = (...args: any[]) => {
  console.error([new Date(), 'ERROR', ...args].join(' - '))
  if (isProduction()) crashlytics().log([new Date(), 'ERROR', ...args].join(' - '))

  if (isProduction()) {
    const errors = args.filter((arg) => arg instanceof Error).filter((arg) => !isNetworkError(arg.message))

    if (errors.length) openCrashReportPrompt(errors)
  }
}
