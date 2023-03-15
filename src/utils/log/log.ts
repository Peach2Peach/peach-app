import crashlytics from '@react-native-firebase/crashlytics'
import { isProduction } from '../system'

export const log = (...args: any[]) => {
  console.log([new Date(), 'LOG', ...args].join(' - '))
  if (isProduction()) crashlytics().log([new Date(), 'LOG', ...args].join(' - '))
}
