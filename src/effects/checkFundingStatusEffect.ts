import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getFundingStatus } from '../utils/peachAPI'

type CheckFundingStatusEffectProps = {
  sellOffer: SellOffer
  onSuccess: (result: FundingStatusResponse) => void
  onError: (err: APIError) => void
}
export default ({ sellOffer, onSuccess, onError }: CheckFundingStatusEffectProps): EffectCallback =>
  () => {
    const checkingFunction = async () => {
      if (
        !sellOffer.id
        || !sellOffer.escrow
        || sellOffer.refunded
        || sellOffer.released
        || sellOffer.funding.status === 'FUNDED'
      ) return
      info('Checking funding status of', sellOffer.id, sellOffer.escrow)

      const [result, err] = await getFundingStatus({
        offerId: sellOffer.id,
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
