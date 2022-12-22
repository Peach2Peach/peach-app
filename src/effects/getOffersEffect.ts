import { EffectCallback } from 'react'
import { getAbortWithTimeout } from '../utils/fetch'
import { error, info } from '../utils/log'
import { getOffers } from '../utils/peachAPI'

const checkingInterval = 60 * 1000

type GetOffersProps = {
  onSuccess: (result: (SellOffer | BuyOffer)[]) => void
  onError: (err: APIError) => void
}
export default ({ onSuccess, onError }: GetOffersProps): EffectCallback =>
  () => {
    let abortCtrl: AbortController
    const checkingFunction = async () => {
      abortCtrl = getAbortWithTimeout(checkingInterval)
      info('Get offers')
      const [result, err] = await getOffers({
        abortSignal: abortCtrl.signal,
      })

      if (result) {
        info(`Got ${result.length} offers`)

        onSuccess(result)
      } else if (err) {
        error('Error', err)
        onError(err)
      }
    }

    const interval = setInterval(checkingFunction, checkingInterval)

    checkingFunction()

    return () => {
      abortCtrl?.abort()
      clearInterval(interval)
    }
  }
