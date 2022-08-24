import messaging from '@react-native-firebase/messaging'
import analytics from '@react-native-firebase/analytics'
import { info } from '../utils/log'
import { account, updateSettings } from '../utils/account'
import { Alert, Linking } from 'react-native'
import i18n from '../utils/i18n'

const openAnalyticsPrompt = (): void => {
  Alert.alert(
    i18n('analytics.requestPermission.title'),
    i18n('analytics.requestPermission.description'),
    [
      {
        text: i18n('privacyPolicy'),
        onPress: () => {
          Linking.openURL('https://www.peachbitcoin.com/privacy-policy/')
          openAnalyticsPrompt()
        },
        style: 'default',
      },
      {
        text: i18n('deny'),
        onPress: () => {
          updateSettings({
            enableAnalytics: false
          }, true)
        },
        style: 'default',
      },
      {
        text: i18n('allow'),
        onPress: async () => {
          await analytics().setAnalyticsCollectionEnabled(true)
          updateSettings({
            enableAnalytics: true
          }, true)
        },
        style: 'default',
      },
    ]
  )
}

export default async () => {
  info('Requesting notification permissions')
  const authStatus = await messaging().requestPermission({
    alert: true,
    badge: false,
    sound: true,
  })

  info('Permission status:', authStatus)

  if (typeof account.settings.enableAnalytics === 'undefined') openAnalyticsPrompt()
}