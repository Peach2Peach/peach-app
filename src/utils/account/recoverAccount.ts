import analytics from '@react-native-firebase/analytics'
import { userUpdate } from '../../init/userUpdate'
import { settingsStore } from '../../store/settingsStore'
import { saveContract } from '../contract'
import { error, info } from '../log'
import { saveOffer } from '../offer'
import { getContracts, getOffers } from '../peachAPI'
import { updateAccount } from './updateAccount'
import { loadAccountFromSeedPhrase } from './loadAccountFromSeedPhrase'

export const recoverAccount = async (account: Account): Promise<Account> => {
  info('Recovering account')

  settingsStore.getState().setFCMToken('')
  settingsStore.getState().setPGPPublished(false)

  updateAccount(account, true)
  if (account.mnemonic) loadAccountFromSeedPhrase(account.mnemonic)

  info('Get offers')
  const [[getOffersResult, getOffersErr], [getContractsResult, getContractsErr]] = await Promise.all([
    getOffers({}),
    getContracts({}),
    userUpdate(),
  ])

  if (getOffersResult?.length) {
    info(`Got ${getOffersResult.length} offers`)
    getOffersResult.map((offer) => saveOffer(offer, true))
  } else if (getOffersErr) {
    error('Error', getOffersErr)
  }
  if (getContractsResult?.length) {
    info(`Got ${getContractsResult.length} Contracts`)
    getContractsResult.map((offer) => saveContract(offer, true))
  } else if (getContractsErr) {
    error('Error', getContractsErr)
  }

  analytics().logEvent('account_restored')
  return account
}
