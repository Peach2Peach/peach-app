import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { postOffer } from '../utils/peachAPI'

type PostOfferEffectProps = {
  offer: SellOffer|BuyOffer,
  onSuccess: (result: PostOfferResponse) => void,
  onError: (err: APIError) => void,
}
export default ({
  offer,
  onSuccess,
  onError
}: PostOfferEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    if (offer.id) return

    info('Posting offer ', JSON.stringify(offer))
    const [result, err] = await postOffer(offer)
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
