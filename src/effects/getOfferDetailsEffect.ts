import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getOfferDetails } from '../utils/peachAPI'

type GetOfferEffectProps = {
  offerId: string,
  interval?: number,
  onSuccess: (result: BuyOffer|SellOffer) => void,
  onError: (error: APIError) => void,
}
export default ({
  offerId,
  interval,
  onSuccess,
  onError
}: GetOfferEffectProps): EffectCallback => () => {
  let intrvl: NodeJS.Timer

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

  if (interval) {
    (async () => {
      intrvl = setInterval(checkingFunction, 30 * 1000)
    })()
    return () => {
      clearInterval(intrvl)
    }
  }


  return () => {}
}
