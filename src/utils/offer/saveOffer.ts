import { account, saveAccount } from '../account'
import { sort } from '../array'
import { info } from '../log'
import { session } from '../session'
import { offerExists } from './offerExists'

/**
  * @description Method to add offer to offer list
  * @param offer the offer
  * @param disableSave if true, don't save account (performance)
  * @param shield if true, don't overwrite sensitive data (returnAddress, releaseAddress, etc...)
  */
export const saveOffer = (offer: SellOffer|BuyOffer, disableSave = false, shield = true): void => {
  info('saveOffer', offer.id, offer)
  if (!offer.id) throw new Error('offerId is required')

  delete offer.user

  if (offerExists(offer.id)) {
    account.offers = account.offers.map(o => {
      if (o.id !== offer.id) return o

      if (shield) {
        if (offer.type === 'ask') {
          if ((o as SellOffer).paymentData) offer.paymentData = (o as SellOffer).paymentData
          if ((o as SellOffer).returnAddress) offer.returnAddress = (o as SellOffer).returnAddress
        } else if ((o as BuyOffer).releaseAddress) {
          offer.releaseAddress = (o as BuyOffer).releaseAddress
        }
      }
      return {
        ...o,
        ...offer
      }
    })
  } else {
    account.offers.push(offer)
  }

  account.offers = account.offers.sort(sort('id'))
  if (session.password && !disableSave) saveAccount(account, session.password)
}