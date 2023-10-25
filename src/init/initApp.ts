import { dataMigrationAfterLoadingAccount, dataMigrationBeforeLoadingAccount } from '../init/dataMigration'
import { userUpdate } from '../init/userUpdate'
import { account, loadAccount } from '../utils/account'
import { getPeachInfo } from './getPeachInfo'
import { getTrades } from './getTrades'

export const initApp = async (): Promise<GetStatusResponse | undefined> => {
  dataMigrationBeforeLoadingAccount()

  await loadAccount()
  const statusResponse = await getPeachInfo()
  if (!statusResponse?.error && account?.publicKey) {
    getTrades()
    userUpdate()
    dataMigrationAfterLoadingAccount()
  }

  return statusResponse
}
