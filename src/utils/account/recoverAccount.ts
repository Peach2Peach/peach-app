import analytics from '@react-native-firebase/analytics'

import { updateSettings } from '.'
import userUpdate from '../../init/userUpdate'
import { contractStore } from '../../store/contractStore'
import { error, info } from '../log'
import { saveOffer } from '../offer'
import { getContracts, getOffers } from '../peachAPI'

export const recoverAccount = async (account: Account): Promise<[Account | null, Error | null]> => {
  info('Recovering account')

  try {
    updateSettings({
      fcmToken: '',
      pgpPublished: false,
    })
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
      getContractsResult.forEach(contractStore.getState().setContract)
    } else if (getContractsErr) {
      error('Error', getContractsErr)
    }

    analytics().logEvent('account_restored')
    return [account, null]
  } catch (e) {
    return [null, e as Error]
  }
}
