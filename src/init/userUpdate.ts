import messaging from '@react-native-firebase/messaging'
import { useSettingsStore } from '../store/settingsStore'
import { useAccountStore } from '../utils/account/account'
import { error, info } from '../utils/log'
import { updateUser } from '../utils/peachAPI'
import { UpdateUserProps } from '../utils/peachAPI/updateUser'
import { parseError } from '../utils/result/parseError'

export const userUpdate = async (referralCode?: string) => {
  const account = useAccountStore.getState().account

  const settings = useSettingsStore.getState()
  try {
    const payload: UpdateUserProps = {}

    let fcmToken = settings.fcmToken
    try {
      fcmToken = await messaging().getToken()
    } catch (e) {
      error('messaging().getToken - Push notifications not supported', parseError(e))
    }

    if (account.pgp.publicKey && !settings.pgpPublished) payload.pgp = account.pgp
    if (settings.fcmToken !== fcmToken) payload.fcmToken = fcmToken
    if (referralCode) payload.referralCode = referralCode

    if (Object.keys(payload).length) {
      const [result, err] = await updateUser(payload)

      if (result) {
        info('Updated user information', 'fcmToken', !!payload.fcmToken, 'pgp', !!payload.pgp)

        useSettingsStore.getState().setPGPPublished(settings.pgpPublished || !!payload.pgp)
        if (fcmToken) useSettingsStore.getState().setFCMToken(fcmToken)
      } else {
        error('User information could not be set', JSON.stringify(err))
      }
    }
  } catch (e) {
    error(e)
  }
}
