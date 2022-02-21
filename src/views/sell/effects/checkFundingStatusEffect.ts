import { EffectCallback } from 'react'
import { error, info } from '../../../utils/logUtils'
import { getFundingStatus } from '../../../utils/peachAPI'

type CheckFundingStatusEffectProps = {
  offer: SellOffer,
  onSuccess: (result: FundingStatusResponse) => void,
  onError: (error: APIError) => void,
}
export default ({
  offer,
  onSuccess,
  onError
}: CheckFundingStatusEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    if (!offer.id || !offer.escrow) return

    info('Checking funding status of', offer.id, offer.escrow)
    const [result, err] = await getFundingStatus({
      offerId: offer.id,
    })
    if (result) {
      onSuccess(result)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  }
  let interval: NodeJS.Timer
  (async () => {
    interval = setInterval(checkingFunction, 20 * 1000)
    checkingFunction()
  })()

  return () => {
    clearInterval(interval)
  }
}
