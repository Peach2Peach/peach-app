import messaging from '@react-native-firebase/messaging'
import { account, updateSettings } from '../utils/account'
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
      // const apnsToken = await messaging().getAPNSToken()
      // if (apnsToken) await messaging().setAPNSToken(apnsToken)
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

        updateSettings({
          pgpPublished: account.settings.pgpPublished || !!payload.pgp,
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
