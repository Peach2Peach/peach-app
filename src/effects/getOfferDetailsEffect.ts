import { EffectCallback } from 'react'
import { getAbortWithTimeout } from '../utils/fetch'
import { error, info } from '../utils/log'
import { getOfferDetails } from '../utils/peachAPI'

type GetOfferEffectProps = {
  offerId: string | null | undefined
  interval?: number
  onSuccess: (result: BuyOffer | SellOffer) => void
  onError: (err: APIError) => void
}
export default ({ offerId, interval, onSuccess, onError }: GetOfferEffectProps): EffectCallback =>
  () => {
    let intrvl: NodeJS.Timer
    let abortCtrl: AbortController
    const checkingFunction = async () => {
      if (!offerId) return
      abortCtrl = getAbortWithTimeout(interval)

      info('Get offer details for', offerId)
      const [result, err] = await getOfferDetails({
        offerId,
        abortSignal: abortCtrl.signal,
      })
      if (result) {
        // info('Got offer details: ', JSON.stringify(result))
        onSuccess(result)
      } else if (err) {
        error('Error', err)
        onError(err)
      }
    }

    checkingFunction()

    if (interval) {
      intrvl = setInterval(checkingFunction, interval)
    }

    return () => {
      abortCtrl?.abort()
      if (intrvl) clearInterval(intrvl)
    }
  }
