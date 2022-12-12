import analytics from '@react-native-firebase/analytics'

import userUpdate from '../../init/userUpdate'
import { error, info } from '../log'
import { saveOffer } from '../offer'
import { getOffers, getTradingLimit } from '../peachAPI'
import { AccountStore } from '../storage/accountStorage'

export const recoverAccount = async (account: AccountStore): Promise<[Account | null, Error | null]> => {
  info('Recovering account')

  try {
    account.updateSettings({
      fcmToken: '',
    })
    info('Get offers')
    const [[getOffersResult, getOffersErr], [getTradingLimitResult, getTradingLimitErr]] = await Promise.all([
      getOffers({}),
      getTradingLimit({}),
      userUpdate(account),
    ])

    if (getOffersResult?.length) {
      info(`Got ${getOffersResult.length} offers`)
      getOffersResult.map((offer) => saveOffer(offer, true))
    } else if (getOffersErr) {
      error('Error', getOffersErr)
    }
    if (getTradingLimitResult) {
      info('Got tradinglimit')
      account.setTradingLimit(getTradingLimitResult)
    } else if (getTradingLimitErr) {
      error('Error', getTradingLimitErr)
    }

    analytics().logEvent('account_restored')
    return [account, null]
  } catch (e) {
    return [null, e as Error]
  }
}
