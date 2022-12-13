import messaging from '@react-native-firebase/messaging'
import { UserDataStore } from '../store'
import { error, info } from '../utils/log'
import { updateUser } from '../utils/peachAPI'
import { UpdateUserProps } from '../utils/peachAPI/private/user/updateUser'
import { parseError } from '../utils/system'

export default async (userDataStore: UserDataStore, referralCode?: string) => {
  const { publicKey, pgp, settings, updateSettings } = userDataStore

  if (!publicKey) return

  try {
    const payload: UpdateUserProps = {}

    let fcmToken = settings.fcmToken
    try {
      fcmToken = await messaging().getToken()
    } catch (e) {
      error('messaging().getToken - Push notifications not supported', parseError(e))
    }

    if (pgp.publicKey && !settings.pgpPublished) payload.pgp = pgp
    if (settings.fcmToken !== fcmToken) payload.fcmToken = fcmToken
    if (referralCode) payload.referralCode = referralCode

    if (Object.keys(payload).length) {
      const [result, err] = await updateUser(payload)

      if (result) {
        info('Updated user information', 'fcmToken', !!payload.fcmToken, 'pgp', !!payload.pgp)

        updateSettings({
          pgpPublished: settings.pgpPublished || !!payload.pgp,
          fcmToken,
        })
      } else {
        error('User information could not be set', JSON.stringify(err))
      }
    }
  } catch (e) {
    error(e)
  }
}
