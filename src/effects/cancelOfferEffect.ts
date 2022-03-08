import { EffectCallback } from 'react'
import { error, info } from '../utils/logUtils'
import { cancelOffer } from '../utils/peachAPI'

type CancelOfferEffectProps = {
  offer: SellOffer|BuyOffer,
  onSuccess: (result: CancelOfferResponse) => void,
  onError: (error: APIError) => void,
}
export default ({
  offer,
  onSuccess,
  onError
}: CancelOfferEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    if (!offer.id) return
    if (offer.type !== 'ask' || !offer.escrow || offer.refunded || offer.released) return

    info('Checking cancelation and refunding info for ', offer.id)
    const [result, err] = await cancelOffer({
      offerId: offer.id,
      satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
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
