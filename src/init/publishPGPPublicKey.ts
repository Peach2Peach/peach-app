import { useSettingsStore } from '../store/settingsStore/useSettingsStore'
import { useAccountStore } from '../utils/account/account'
import { error } from '../utils/log/error'
import { info } from '../utils/log/info'
import { updateUser } from '../utils/peachAPI/updateUser'

export const publishPGPPublicKey = async () => {
  const account = useAccountStore.getState().account

  // TODO this can be improved by getting self user and compare the pubkeys
  // if a pubkey is new locally, send it and encrypt it with existing pubkeys
  // if a pubkey is new remotely, try to decrypt it with existing pubkey
  // consider showing a toast with the sync
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
