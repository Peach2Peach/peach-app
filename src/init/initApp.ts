import { dataMigrationAfterLoadingAccount, dataMigrationBeforeLoadingAccount } from '../init/dataMigration'
import events from '../init/events'
import requestUserPermissions from '../init/requestUserPermissions'
import { getPeachInfo, getTrades } from '../init/session'
import userUpdate from '../init/userUpdate'
import { account, loadAccount } from '../utils/account'

/**
 * @description Method to initialize app by retrieving app session and user account
 */
export const initApp = async (): Promise<void> => {
  events()
  await dataMigrationBeforeLoadingAccount()

  await loadAccount()
  await getPeachInfo(account)
  if (account?.publicKey) {
    getTrades()
    userUpdate()
    await dataMigrationAfterLoadingAccount()
  }

  await requestUserPermissions()
}
