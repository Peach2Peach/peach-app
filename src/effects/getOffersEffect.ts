import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getOffers } from '../utils/peachAPI'

type GetOffersProps = {
  onSuccess: (result: (SellOffer | BuyOffer)[]) => void
  onError: (err: APIError) => void
}
export default ({ onSuccess, onError }: GetOffersProps): EffectCallback =>
  () => {
    const checkingInterval = 60 * 1000
    const checkingFunction = async () => {
      info('Get offers')
      const [result, err] = await getOffers({
        timeout: checkingInterval,
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
      clearInterval(interval)
    }
  }
