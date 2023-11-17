import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { useAccountStore } from '../account/account'
import { storeOffer } from '../account/storeAccount'
import { error, info } from '../log'
import { getSummaryFromOffer } from './getSummaryFromOffer'
import { offerExists } from './offerExists'

export const saveOffer = (offer: SellOffer | BuyOffer) => {
  if (!offer.id) {
    error('saveOffer', 'offer.id is undefined')
    return
  }

  useAccountStore.setState((state) => {
    const newOffers = offerExists(offer.id)
      ? state.account.offers.map((o) => {
        if (o.id !== offer.id) return o

        return {
          ...o,
          ...offer,
        }
      })
      : state.account.offers.concat(offer)

    return {
      account: {
        ...state.account,
        offers: newOffers.sort((a, b) => (a.id === b.id ? 0 : a.id > b.id ? 1 : -1)),
      },
    }
  })

  storeOffer(offer)
  info('saveOffer', offer.id)
  useTradeSummaryStore.getState().setOffer(offer.id, getSummaryFromOffer(offer))
}
