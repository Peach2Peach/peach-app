import { EffectCallback } from 'react'
import { getAbortWithTimeout } from '../utils/fetch'
import { error, info } from '../utils/log'
import { isSellOffer } from '../utils/offer'
import { isFunded } from '../utils/offer/status'
import { getMatches } from '../utils/peachAPI'

const checkingInterval = 15 * 1000

type SearchForPeersEffectProps = {
  offer: SellOffer | BuyOffer
  page?: number
  size?: number
  onBefore?: () => void
  onSuccess: (result: Match[]) => void
  onError: (err: APIError) => void
}
export default ({
  offer,
  page = 0,
  size = 21,
  onBefore,
  onSuccess,
  onError,
}: SearchForPeersEffectProps): EffectCallback =>
  () => {
    let abortCtrl: AbortController
    const checkingFunction = async () => {
      abortCtrl = getAbortWithTimeout(checkingInterval)
      if (!offer?.id) return
      if (offer.doubleMatched) return
      if (isSellOffer(offer) && !isFunded(offer)) return

      if (onBefore) onBefore()

      info('Checking matches for', offer.id)

      const [result, err] = await getMatches({
        offerId: offer.id,
        page,
        size,
        abortSignal: abortCtrl.signal,
      })

      if (result) {
        info('matches: ', result.matches.length)
        onSuccess(result.matches)
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
