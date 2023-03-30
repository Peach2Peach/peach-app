import messaging from '@react-native-firebase/messaging'
import { settingsStore } from '../store/settingsStore'
import { account } from '../utils/account'
import { error, info } from '../utils/log'
import { updateUser } from '../utils/peachAPI'
import { UpdateUserProps } from '../utils/peachAPI/private/user/updateUser'
import { parseError } from '../utils/system'

export default async (referralCode?: string) => {
  if (!account) return

  try {
    const payload: UpdateUserProps = {}

    let fcmToken = account.settings.fcmToken
    try {
      fcmToken = await messaging().getToken()
    } catch (e) {
      error('messaging().getToken - Push notifications not supported', parseError(e))
    }

    if (account.pgp.publicKey && !account.settings.pgpPublished) payload.pgp = account.pgp
    if (account.settings.fcmToken !== fcmToken) payload.fcmToken = fcmToken
    if (referralCode) payload.referralCode = referralCode

    if (Object.keys(payload).length) {
      const [result, err] = await updateUser(payload)

      if (result) {
        info('Updated user information', 'fcmToken', !!payload.fcmToken, 'pgp', !!payload.pgp)

        settingsStore.getState().setPGPPublished(account.settings.pgpPublished || !!payload.pgp)
        if (fcmToken) settingsStore.getState().setFCMToken(fcmToken)
      } else {
        error('User information could not be set', JSON.stringify(err))
      }
    }
  } catch (e) {
    error(e)
  }
}
