import messaging from '@react-native-firebase/messaging'
import analytics from '@react-native-firebase/analytics'
import { info } from '../utils/log'
import { account, updateSettings } from '../utils/account'
import { Alert } from 'react-native'
import i18n from '../utils/i18n'

const openAnalyticsPrompt = () => {
  Alert.alert(
    i18n('analytics.requestPermission.title'),
    i18n('analytics.requestPermission.description'),
    [
      {
        text: i18n('privacyPolicy'),
        onPress: () => {
          Alert.alert('Privacy policy will be added soon!', '',
            [
              {
                text: i18n('close'),
                onPress: openAnalyticsPrompt,
                style: 'default',
              }
            ]
          )
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