
import messaging from '@react-native-firebase/messaging'
import { account, updateSettings } from '../utils/account'
import { error, info } from '../utils/log'
import { setFCMToken } from '../utils/peachAPI'

export default async () => {
  if (!account) return
  try {
    const fcmToken = await messaging().getToken()
    if (account.settings.fcmToken !== fcmToken) {
      const [result, err] = await setFCMToken(fcmToken)

      if (result) {
        info('Set FCM for user', fcmToken)
        updateSettings({
          fcmToken
        })
      } else {
        error('FCM could not be set', JSON.stringify(err))
      }
    }
  } catch (e) {
    error(e)
  }
}