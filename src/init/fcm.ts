
import messaging from '@react-native-firebase/messaging'
import { account, updateSettings } from '../utils/account'
import { error, info } from '../utils/log'
import { setFCMToken } from '../utils/peachAPI'

export default async () => {
  try {
    if (account && !account.settings.fcmTokenPublished) {
      const fcmToken = await messaging().getToken()
      const [result, err] = await setFCMToken(fcmToken)

      if (result) {
        info('Set FCM for user', fcmToken)
        updateSettings({
          fcmTokenPublished: true
        })
      } else {
        error('FCM could not be set', JSON.stringify(err))
      }
    }
  } catch (e) {
    error(e)
  }
}