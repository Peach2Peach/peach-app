import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getMatches } from '../utils/peachAPI'

type SearchForPeersEffectProps = {
  offer: SellOffer|BuyOffer,
  onSuccess: (result: Match[]) => void,
  onError: (err: APIError) => void,
}
export default ({
  offer,
  onSuccess,
  onError
}: SearchForPeersEffectProps): EffectCallback => () => {
  let interval: NodeJS.Timer

  const checkingFunction = async () => {
    if (!offer.id) return
    if (offer.doubleMatched) return
    if (offer.type === 'ask' && (!offer.funding || offer.funding.status !== 'FUNDED')) return

    info('Checking matches for', offer.id)
    const [result, err] = await getMatches({
      offerId: offer.id,
    })
    if (result) {
      info('matches: ', JSON.stringify(result.matches))
      if (result.matches.length > 0) clearInterval(interval)
      onSuccess(result.matches)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  }
  (async () => {
    interval = setInterval(checkingFunction, 30 * 1000)
    checkingFunction()
  })()

  return () => {
    clearInterval(interval)
  }
}
