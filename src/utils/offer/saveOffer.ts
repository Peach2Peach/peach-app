import { account } from '../account'
import { storeOffer } from '../account/storeAccount'
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
  if (!offer.id) throw new Error('offerId is required')

  delete offer.user

  if (offerExists(offer.id)) {
    account.offers = account.offers.map(o => {
      if (o.id !== offer.id) return o

      if (shield) {
        if (o.paymentData) offer.paymentData = o.paymentData
        if (offer.type === 'ask') {
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
  if (session.password && !disableSave) {
    storeOffer(offer, session.password)
    info('saveOffer', offer.id)
  }
}

/**
 * @description Method to add offers to offer list
 * @param offers the offers
 * @param shield if true, don't overwrite sensitive data (returnAddress, releaseAddress, etc...)
 */
export const saveOffers = (offers: (SellOffer|BuyOffer)[], shield = true): void => {
  info('saveOffers', offers.length)

  offers.map(offer => saveOffer(offer, true, shield))
}