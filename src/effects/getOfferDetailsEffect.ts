import { EffectCallback } from 'react'
import { error, info } from '../utils/logUtils'
import { getOfferDetails } from '../utils/peachAPI'

type GetOfferEffectProps = {
  offerId: string,
  onSuccess: (result: BuyOffer|SellOffer) => void,
  onError: (error: APIError) => void,
}
export default ({
  offerId,
  onSuccess,
  onError
}: GetOfferEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    if (!offerId) return

    info('Get offer details for', offerId)
    const [result, err] = await getOfferDetails(offerId)
    if (result) {
      info('Got offer details: ', JSON.stringify(result))
      onSuccess(result)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  }
  checkingFunction()
}
