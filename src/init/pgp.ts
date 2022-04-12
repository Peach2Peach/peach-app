
import { account, updateSettings } from '../utils/account'
import { setPGP } from '../utils/peachAPI'

export default async () => {
  if (account.pgp && !account.settings.pgpPublished) {
    const [result] = await setPGP(account.pgp)

    if (result) {
      updateSettings({
        pgpPublished: true
      })
    }
  }
}