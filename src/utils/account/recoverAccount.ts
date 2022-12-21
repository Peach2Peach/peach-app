import analytics from '@react-native-firebase/analytics'

import { updateSettings } from '.'
import userUpdate from '../../init/userUpdate'
import { saveContract } from '../contract'
import { error, info } from '../log'
import { saveOffer } from '../offer'
import { getContracts, getOffers, getTradingLimit } from '../peachAPI'
import { updateTradingLimit } from './tradingLimit'

export const recoverAccount = async (account: Account): Promise<[Account | null, Error | null]> => {
  info('Recovering account')

  try {
    updateSettings({
      fcmToken: '',
    })
    info('Get offers')
    const [
      [getOffersResult, getOffersErr],
      [getContractsResult, getContractsErr],
      [getTradingLimitResult, getTradingLimitErr],
    ] = await Promise.all([getOffers({}), getContracts({}), getTradingLimit({}), userUpdate()])

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
    if (getTradingLimitResult) {
      info('Got tradinglimit')
      updateTradingLimit(getTradingLimitResult)
    } else if (getTradingLimitErr) {
      error('Error', getTradingLimitErr)
    }

    analytics().logEvent('account_restored')
    return [account, null]
  } catch (e) {
    return [null, e as Error]
  }
}
