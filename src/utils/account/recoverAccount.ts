import analytics from '@react-native-firebase/analytics'

import { setAccount } from '.'
import { decrypt } from '../crypto'
import { error, info } from '../log'
import { saveOffer } from '../offer'
import { getOffers, getTradingLimit } from '../peachAPI'
import { setSession } from '../session'
import { account } from './account'
import { updateTradingLimit } from './tradingLimit'

interface RecoverAccountProps {
  encryptedAccount: string,
  password: string,
}

/**
 * @description Method to recover account
 * @param props.encryptedAccount the account but password encrypted
 * @param [props.password] secret
 */
export const recoverAccount = async ({
  encryptedAccount,
  password = ''
}: RecoverAccountProps): Promise<[Account|null, Error|null]> => {
  info('Recovering account')

  try {
    await setAccount(JSON.parse(decrypt(encryptedAccount, password)))
    await setSession({ password })

    info('Get offers')
    const [
      [getOffersResult, getOffersErr],
      [getTradingLimitResult, getTradingLimitErr],
    ] = await Promise.all([
      getOffers(),
      getTradingLimit(),
    ])
    if (getOffersResult?.length) {
      info(`Got ${getOffersResult.length} offers`)
      getOffersResult.map(offer => saveOffer(offer, true))
    } else if (getOffersErr) {
      error('Error', getOffersErr)
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