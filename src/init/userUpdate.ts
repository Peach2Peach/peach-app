
import messaging from '@react-native-firebase/messaging'
import { account, updateSettings } from '../utils/account'
import { error, info } from '../utils/log'
import { updateUser } from '../utils/peachAPI'
import { UpdateUserProps } from '../utils/peachAPI/private/user/updateUser'

export default async (referralCode?: string) => {
  if (!account) return

  try {
    const payload: UpdateUserProps = {}
    const fcmToken = await messaging().getToken()

    if (account.pgp.publicKey && !account.settings.pgpPublished) payload.pgp = account.pgp
    if (account.settings.fcmToken !== fcmToken) payload.fcmToken = fcmToken
    if (referralCode) payload.referralCode = referralCode

    if (Object.keys(payload).length) {
      const [result, err] = await updateUser(payload)

      if (result) {
        info('Updated user information', fcmToken)

        updateSettings({
          pgpPublished: account.settings.pgpPublished || !!account.pgp,
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
