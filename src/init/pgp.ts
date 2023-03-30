import { settingsStore } from '../store/settingsStore'
import { account } from '../utils/account'
import { error, info } from '../utils/log'
import { updateUser } from '../utils/peachAPI'

export default async () => {
  try {
    if (account.pgp.publicKey && !account.settings.pgpPublished) {
      const [result, err] = await updateUser({ pgp: account.pgp })

      if (result) {
        info('Set PGP for user', account.publicKey)
        settingsStore.getState().setPGPPublished(true)
      } else {
        error('PGP could not be set', JSON.stringify(err))
      }
    }
  } catch (e) {
    error(e)
  }
}
