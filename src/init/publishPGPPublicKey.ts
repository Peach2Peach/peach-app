import { useSettingsStore } from '../store/settingsStore'
import { useAccountStore } from '../utils/account/account'
import { error } from '../utils/log/error'
import { info } from '../utils/log/info'
import { updateUser } from '../utils/peachAPI'

export const publishPGPPublicKey = async () => {
  const account = useAccountStore.getState().account
  if (!account.pgp.publicKey) return
  try {
    const [result, err] = await updateUser({ pgp: account.pgp })

    if (result) {
      info('Set PGP for user', account.publicKey)
      useSettingsStore.getState().setPGPPublished(true)
    } else {
      error('PGP could not be set', JSON.stringify(err))
    }
  } catch (e) {
    error(e)
  }
}
