import crashlytics from '@react-native-firebase/crashlytics'
import { isProduction } from '../system/isProduction'

export const info = (...args: any[]) => {
  if (isProduction()) {
    crashlytics().log([new Date(), 'INFO', ...args].join(' - '))
  } else {
    console.info([new Date(), 'INFO', ...args].join(' - '))
  }
}
