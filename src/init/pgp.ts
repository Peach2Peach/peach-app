
import { account, updateSettings } from '../utils/account'
import { error, info } from '../utils/log'
import { setPGP } from '../utils/peachAPI'

export default async () => {
  if (account.pgp && !account.settings.pgpPublished) {
    const [result, err] = await setPGP(account.pgp)

    if (result) {
      info('Set PGP for user', account.publicKey)
      updateSettings({
        pgpPublished: true
      })
    } else {
      error('PGP could not be set', JSON.stringify(err))
    }
  }
}