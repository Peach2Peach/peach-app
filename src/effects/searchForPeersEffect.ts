import { EffectCallback } from 'react'
import { error, info } from '../utils/logUtils'
import { getMatches } from '../utils/peachAPI'

type SearchForPeersEffectProps = {
  offer: SellOffer|BuyOffer,
  onSuccess: (result: Match[]) => void,
  onError: (error: APIError) => void,
}
export default ({
  offer,
  onSuccess,
  onError
}: SearchForPeersEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    if (!offer.id
      || (offer.type === 'ask' && (!offer.funding || offer.funding.status !== 'FUNDED'))) return

    info('Checking matches for', offer.id)
    const [result, err] = await getMatches({
      offerId: offer.id,
    })
    if (result) {
      onSuccess(result.matches)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  }
  let interval: NodeJS.Timer
  (async () => {
    interval = setInterval(checkingFunction, 60 * 1000)
    checkingFunction()
  })()

  return () => {
    clearInterval(interval)
  }
}
