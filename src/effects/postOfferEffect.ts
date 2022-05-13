import { EffectCallback } from 'react'
import pgp from '../init/pgp'
import { updateTradingLimit } from '../utils/account'
import { error, info } from '../utils/log'
import { getTradingLimit, postOffer } from '../utils/peachAPI'

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

    await pgp() // make sure pgp has been sent

    const [result, err] = await postOffer(offer)
    if (result) {
      info('posted offer: ', JSON.stringify(result))
      const [tradingLimit] = await getTradingLimit()

      if (tradingLimit) {
        updateTradingLimit(tradingLimit)
      }
      onSuccess(result)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  }
  checkingFunction()
}
