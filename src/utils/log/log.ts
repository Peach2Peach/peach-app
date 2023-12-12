import crashlytics from '@react-native-firebase/crashlytics'
import { isProduction } from '../system/isProduction'

export const log = (...args: any[]) => {
  if (isProduction()) {
    crashlytics().log([new Date(), 'LOG', ...args].join(' - '))
  } else {
    console.log([new Date(), 'LOG', ...args].join(' - '))
  }
}
