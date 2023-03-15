import crashlytics from '@react-native-firebase/crashlytics'
import { isProduction } from '../system'

export const info = (...args: any[]) => {
  console.info([new Date(), 'INFO', ...args].join(' - '))
  if (isProduction()) crashlytics().log([new Date(), 'INFO', ...args].join(' - '))
}
