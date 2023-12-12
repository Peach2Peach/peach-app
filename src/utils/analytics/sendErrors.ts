import crashlytics from '@react-native-firebase/crashlytics'
import { isAirplaneModeSync } from 'react-native-device-info'
import { appendFile } from '../file/appendFile'
import { info } from '../log'

export const sendErrors = async (errors: Error[]) => {
  if (isAirplaneModeSync()) {
    await appendFile('/error.log', errors.map((e) => e.message).join('\n'), true)
    return
  }

  info('Crashlytics is enabled, sending crash reports', errors.length)

  errors.forEach((err) => {
    crashlytics().recordError(err)
  })
}
