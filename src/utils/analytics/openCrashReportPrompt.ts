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
          Linking.openURL('https://www.peachbitcoin.com/privacyPolicy.html')
        },
        style: 'default',
      },
      {
        text: i18n('crashReport.requestPermission.deny'),
        onPress: () => {},
        style: 'default',
      },
      {
        text: i18n('crashReport.requestPermission.sendReport'),
        onPress: async () => {
          crashlytics().sendUnsentReports()
        },
        style: 'default',
      },
    ]
  )
}