import { dataMigrationAfterLoadingAccount, dataMigrationBeforeLoadingAccount } from '../init/dataMigration'
import { userUpdate } from '../init/userUpdate'
import { account, loadAccount } from '../utils/account'
import { getPeachInfo } from './getPeachInfo'
import { getTrades } from './getTrades'
import { saveMeetupEvents } from './saveMeetupEvents'

export const initApp = async (): Promise<GetStatusResponse | undefined> => {
  await dataMigrationBeforeLoadingAccount()

  await loadAccount()
  const statusResponse = await getPeachInfo()
  if (!statusResponse?.error && account?.publicKey) {
    getTrades()
    userUpdate()
    await dataMigrationAfterLoadingAccount(account)
  }
  if (!statusResponse?.error) saveMeetupEvents()
  return statusResponse
}
