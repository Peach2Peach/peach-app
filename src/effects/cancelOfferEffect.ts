import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { isSellOffer } from '../utils/offer'
import { cancelOffer } from '../utils/peachAPI'

type CancelOfferEffectProps = {
  offer: SellOffer | BuyOffer
  onSuccess: (result: CancelOfferResponse) => void
  onError: (err: APIError) => void
}
export default ({ offer, onSuccess, onError }: CancelOfferEffectProps): EffectCallback =>
  () => {
    const checkingFunction = async () => {
      if (!offer.id) return
      if (!isSellOffer(offer) || !offer.escrow || offer.refunded || offer.released || (offer.tx && offer.txId)) return

      info('Checking cancelation and refunding info for ', offer.id)
      const [result, err] = await cancelOffer({
        offerId: offer.id,
      })
      if (result) {
        info('cancel offer: ', JSON.stringify(result))
        onSuccess(result)
      } else if (err) {
        error('Error', err)
        onError(err)
      }
    }
    checkingFunction()
  }
