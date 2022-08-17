import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getMatches } from '../utils/peachAPI'

type SearchForPeersEffectProps = {
  offer: SellOffer|BuyOffer
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
  onError
}: SearchForPeersEffectProps): EffectCallback => () => {
  let interval: NodeJS.Timer

  const checkingFunction = async () => {
    if (!offer?.id) return
    if (offer.doubleMatched) return
    if (offer.type === 'ask' && (!offer.funding || offer.funding.status !== 'FUNDED')) return

    if (onBefore) onBefore()

    info('Checking matches for', offer.id)

    const [result, err] = await getMatches({
      offerId: offer.id,
      page, size,
    })
    if (result) {
      info('matches: ', result.matches.length)
      onSuccess(result.matches)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  }
  (async () => {
    interval = setInterval(checkingFunction, 15 * 1000)
    checkingFunction()
  })()

  return () => {
    clearInterval(interval)
  }
}
