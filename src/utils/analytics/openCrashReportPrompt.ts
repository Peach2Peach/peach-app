import crashlytics from '@react-native-firebase/crashlytics'
import { Alert, Linking } from 'react-native'
import i18n from '../i18n'

export const openCrashReportPrompt = (): void => {
  Alert.alert(
    i18n('crashReport.requestPermission.title'),
    [
      i18n('crashReport.requestPermission.description.1'),
      i18n('crashReport.requestPermission.description.2'),
    ].join('\n\n'),
    [
      {
        text: i18n('privacyPolicy'),
        onPress: () => {
          openCrashReportPrompt()
          Linking.openURL('https://www.peachbitcoin.com/privacy-policy/')
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
          crashlytics().sendUnsentReports()
        },
        style: 'default',
      },
    ]
  )
}