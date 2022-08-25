import analytics from '@react-native-firebase/analytics'
import { Alert, Linking } from 'react-native'
import { updateSettings } from '../account'
import i18n from '../i18n'

export const openAnalyticsPrompt = (): void => {
  Alert.alert(
    i18n('analytics.requestPermission.title'),
    i18n('analytics.requestPermission.description'),
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
          updateSettings({
            enableAnalytics: false
          })
        },
        style: 'default',
      },
      {
        text: i18n('allow'),
        onPress: async () => {
          await analytics().setAnalyticsCollectionEnabled(true)
          updateSettings({
            enableAnalytics: true
          })
        },
        style: 'default',
      },
    ]
  )
}
