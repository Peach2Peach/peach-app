import { account, saveAccount } from '../account'
import { info } from '../logUtils'
import { session } from '../session'
import { offerExists } from './offerExists'

/**
  * @description Method to add offer to offer list
  * @param offer the offer
  */
export const saveOffer = (offer: SellOffer|BuyOffer): void => {
  info('saveOffer', offer)
  if (!offer.id) throw new Error('offerId is required')

  if (offerExists(offer.id)) {
    const index = account.offers.findIndex(o => o.id === offer.id)
    account.offers[index] = {
      ...account.offers[index],
      ...offer
    }
  } else {
    account.offers.push(offer)
  }
  if (session.password) saveAccount(account, session.password)
}