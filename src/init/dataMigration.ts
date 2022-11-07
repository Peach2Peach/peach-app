import { account } from '../utils/account'
import { storeAccount } from '../utils/account/storeAccount'
import { exists } from '../utils/file'
import { session } from '../utils/session'

export const dataMigration = async () => {
  if (session.password && !(await exists('/peach-account-identity.json'))) {
    await storeAccount(account, session.password)
  }
}
