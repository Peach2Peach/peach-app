import { error, info } from '../utils/log'
import { updateUser } from '../utils/peachAPI'
import { AccountStore } from '../utils/storage/accountStorage'

export default async (account: AccountStore) => {
  try {
    if (account.pgp.publicKey && !account.settings.pgpPublished) {
      const [result, err] = await updateUser({ pgp: account.pgp })

      if (result) {
        info('Set PGP for user', account.publicKey)
        account.updateSettings({
          pgpPublished: true,
        })
      } else {
        error('PGP could not be set', JSON.stringify(err))
      }
    }
  } catch (e) {
    error(e)
  }
}
