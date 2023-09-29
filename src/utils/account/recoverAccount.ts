import analytics from '@react-native-firebase/analytics'
import { userUpdate } from '../../init/userUpdate'
import { useSettingsStore } from '../../store/settingsStore'
import { error, info } from '../log'
import { getContracts, getOffers } from '../peachAPI'
import { updateAccount } from './updateAccount'

export const recoverAccount = async (account: Account): Promise<Account> => {
  info('Recovering account')

  useSettingsStore.getState().setFCMToken('')
  useSettingsStore.getState().setPGPPublished(false)

  updateAccount(account, true)

  info('Get offers')
  const [[getOffersResult, getOffersErr], [getContractsResult, getContractsErr]] = await Promise.all([
    getOffers({}),
    getContracts({}),
    userUpdate(),
  ])

  if (getOffersResult?.length) {
    info(`Got ${getOffersResult.length} offers`)
    // eslint-disable-next-line require-atomic-updates
    account.offers = getOffersResult
  } else if (getOffersErr) {
    error('Error', getOffersErr)
  }
  if (getContractsResult?.length) {
    info(`Got ${getContractsResult.length} Contracts`)
    // eslint-disable-next-line require-atomic-updates
    account.contracts = getContractsResult
  } else if (getContractsErr) {
    error('Error', getContractsErr)
  }

  analytics().logEvent('account_restored')
  return account
}
