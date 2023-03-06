import messaging from '@react-native-firebase/messaging'
import { account, updateSettings } from '../utils/account'
import { error, info } from '../utils/log'
import { updateUser } from '../utils/peachAPI'
import { parseError } from '../utils/system'

export default async () => {
  if (!account) return
  try {
    const fcmToken = await messaging().getToken()

    if (account.settings.fcmToken !== fcmToken) {
      const [result, err] = await updateUser({ fcmToken })

      if (result) {
        info('Set FCM for user', fcmToken)
        updateSettings(
          {
            fcmToken,
          },
          true,
        )
      } else {
        error('FCM could not be set', JSON.stringify(err))
      }
    }
  } catch (e) {
    error('messaging().getToken - Push notifications not supported', parseError(e))
  }
}
