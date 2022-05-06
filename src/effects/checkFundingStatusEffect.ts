import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getFundingStatus } from '../utils/peachAPI'

type CheckFundingStatusEffectProps = {
  offer: SellOffer,
  onSuccess: (result: FundingStatusResponse) => void,
  onError: (err: APIError) => void,
}
export default ({
  offer,
  onSuccess,
  onError
}: CheckFundingStatusEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    if (!offer.id || !offer.escrow || offer.refunded || offer.released || offer.funding?.status === 'FUNDED') return
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
  const interval = setInterval(checkingFunction, 20 * 1000)
  checkingFunction()

  return () => {
    clearInterval(interval)
  }
}
