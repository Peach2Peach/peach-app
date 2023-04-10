import analytics from '@react-native-firebase/analytics'

import userUpdate from '../../init/userUpdate'
import { settingsStore } from '../../store/settingsStore'
import { saveContract } from '../contract'
import { error, info } from '../log'
import { saveOffer } from '../offer'
import { getContracts, getOffers } from '../peachAPI'

export const recoverAccount = async (account: Account): Promise<[Account | null, Error | null]> => {
  info('Recovering account')

  try {
    settingsStore.getState().setFCMToken('')
    settingsStore.getState().setPGPPublished(false)
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
    return [account, null]
  } catch (e) {
    return [null, e as Error]
  }
}
