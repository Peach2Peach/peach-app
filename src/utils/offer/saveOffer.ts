import { account, saveAccount } from '../account'
import { sort } from '../array'
import { info } from '../log'
import { session } from '../session'
import { offerExists } from './offerExists'

/**
  * @description Method to add offer to offer list
  * @param offer the offer
  */
export const saveOffer = (offer: SellOffer|BuyOffer, disableSave = false): void => {
  info('saveOffer', offer)
  if (!offer.id) throw new Error('offerId is required')

  delete offer.user

  if (offerExists(offer.id)) {
    const index = account.offers.findIndex(o => o.id === offer.id)
    account.offers[index] = {
      ...account.offers[index],
      ...offer
    }
  } else {
    account.offers.push(offer)
  }

  account.offers = account.offers.sort(sort('id'))
  if (session.password && !disableSave) saveAccount(account, session.password)
}