import { dataMigrationBeforeLoadingAccount } from '../init/dataMigration'
import events from '../init/events'
import { loadAccount } from '../utils/account'
import { getPeachInfo } from './getPeachInfo'
import { saveMeetupEvents } from './saveMeetupEvents'

export const initApp = async (): Promise<GetStatusResponse | undefined> => {
  const statusResponse = await getPeachInfo()

  events()

  await dataMigrationBeforeLoadingAccount()
  loadAccount()

  if (!statusResponse?.error) saveMeetupEvents()
  return statusResponse
}
