import crashlytics from '@react-native-firebase/crashlytics'
import { Alert, Linking } from 'react-native'
import { isAirplaneModeSync } from 'react-native-device-info'
import { appendFile } from '../file'
import i18n from '../i18n'
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

export const openCrashReportPrompt = (errors: Error[]): void => {
  Alert.alert(
    i18n('crashReport.requestPermission.title'),
    [i18n('crashReport.requestPermission.description.1'), i18n('crashReport.requestPermission.description.2')].join(
      '\n\n',
    ),
    [
      {
        text: i18n('privacyPolicy'),
        onPress: () => {
          openCrashReportPrompt(errors)
          Linking.openURL('https://www.peachbitcoin.com/privacyPolicy.html')
        },
        style: 'default',
      },
      {
        text: i18n('crashReport.requestPermission.deny'),
        onPress: () => {
          crashlytics().deleteUnsentReports()
        },
        style: 'default',
      },
      {
        text: i18n('crashReport.requestPermission.sendReport'),
        onPress: () => {
          sendErrors(errors)
        },
        style: 'default',
      },
    ],
  )
}
