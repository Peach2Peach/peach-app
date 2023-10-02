import analytics from '@react-native-firebase/analytics'
import { userUpdate } from '../../init/userUpdate'
import { useSettingsStore } from '../../store/settingsStore'
import { saveContract } from '../contract'
import { error, info } from '../log'
import { saveOffer } from '../offer'
import { peachAPI } from '../peachAPI'
import { updateAccount } from './updateAccount'

export const recoverAccount = async (account: Account): Promise<Account> => {
  info('Recovering account')

  useSettingsStore.getState().setFCMToken('')
  useSettingsStore.getState().setPGPPublished(false)

  updateAccount(account, true)

  info('Get offers')
  const [{ result: getOffersResult, error: getOffersErr }, { result: getContractsResult, error: getContractsErr }]
    = await Promise.all([peachAPI.private.offer.getOffers(), peachAPI.private.contract.getContracts(), userUpdate()])

  if (getOffersResult?.length) {
    info(`Got ${getOffersResult.length} offers`)
    getOffersResult.map((offer) => saveOffer(offer, true))
  } else if (getOffersErr) {
    error('Error', getOffersErr)
  }
  if (getContractsResult?.length) {
    info(`Got ${getContractsResult.length} Contracts`)
    getContractsResult.map((contract) => saveContract(contract, true))
  } else if (getContractsErr) {
    error('Error', getContractsErr)
  }

  analytics().logEvent('account_restored')
  return account
}
