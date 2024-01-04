import analytics from '@react-native-firebase/analytics'
import { userUpdate } from '../../init/userUpdate'
import { useSettingsStore } from '../../store/settingsStore'
import { error, info } from '../log'
import { peachAPI } from '../peachAPI'
import { updateAccount } from './updateAccount'

export const recoverAccount = async (account: Account): Promise<Account> => {
  info('Recovering account')

  useSettingsStore.getState().setFCMToken('')
  useSettingsStore.getState().setPGPPublished(false)

  updateAccount(account, true)

  info('Get offers')
  const [{ result: getOffersResult, error: getOffersErr }] = await Promise.all([
    peachAPI.private.offer.getOffers(),
    userUpdate(),
  ])

  analytics().logEvent('account_restored')
  if (getOffersResult?.length) {
    info(`Got ${getOffersResult.length} offers`)
    return {
      ...account,
      offers: getOffersResult,
    }
  } else if (getOffersErr) {
    error('Error', getOffersErr)
  }

  return account
}
