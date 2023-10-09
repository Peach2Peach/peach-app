import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { account } from '../account'
import { storeOffer } from '../account/storeAccount'
import { sort } from '../array'
import { error, info } from '../log'
import { getSummaryFromOffer } from './getSummaryFromOffer'
import { isBuyOffer } from './isBuyOffer'
import { isSellOffer } from './isSellOffer'
import { offerExists } from './offerExists'

/**
 * @description Method to add offer to offer list
 * @param offer the offer
 * @param disableSave if true, don't save account (performance)
 * @param shield if true, don't overwrite sensitive data (returnAddress, releaseAddress, etc...)
 */
export const saveOffer = (offer: SellOffer | BuyOffer, disableSave = false, shield = true): void => {
  if (!offer.id) {
    error('saveOffer', 'offer.id is undefined')
    return
  }

  delete offer.user

  if (offerExists(offer.id)) {
    account.offers = account.offers.map((o) => {
      if (o.id !== offer.id) return o

      if (shield) {
        if (isSellOffer(offer)) {
        } else if (isBuyOffer(o) && o.releaseAddress) {
          offer.releaseAddress = o.releaseAddress
        }
      }
      return {
        ...o,
        ...offer,
      }
    })
  } else {
    account.offers.push(offer)
  }

  account.offers = account.offers.sort(sort('id'))
  if (!disableSave) {
    storeOffer(offer)
    info('saveOffer', offer.id)
  }
  useTradeSummaryStore.getState().setOffer(offer.id, getSummaryFromOffer(offer))
}
