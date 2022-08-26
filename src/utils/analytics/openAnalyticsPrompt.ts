import analytics from '@react-native-firebase/analytics'
import { Alert, Linking } from 'react-native'
import { updateSettings } from '../account'
import i18n from '../i18n'

export const openAnalyticsPrompt = (): void => {
  Alert.alert(
    i18n('analytics.requestPermission.title'),
    [
      i18n('analytics.requestPermission.description.1'),
      i18n('analytics.requestPermission.description.2'),
    ].join('\n\n'),
    [
      {
        text: i18n('privacyPolicy'),
        onPress: () => {
          openAnalyticsPrompt()
          Linking.openURL('https://www.peachbitcoin.com/privacy-policy/')
        },
        style: 'default',
      },
      {
        text: i18n('deny'),
        onPress: () => {
          analytics().setAnalyticsCollectionEnabled(false)
          updateSettings({
            enableAnalytics: false
          }, true)
        },
        style: 'default',
      },
      {
        text: i18n('allow'),
        onPress: async () => {
          analytics().setAnalyticsCollectionEnabled(true)
          updateSettings({
            enableAnalytics: true
          }, true)
        },
        style: 'default',
      },
    ]
  )
}