import { EffectCallback } from 'react'
import { getAbortWithTimeout } from '../utils/getAbortWithTimeout'
import { error, info } from '../utils/log'
import { getFundingStatus } from '../utils/peachAPI'

const checkingInterval = 20 * 1000

type CheckFundingStatusEffectProps = {
  sellOffer: SellOffer
  onSuccess: (result: FundingStatusResponse) => void
  onError: (err: APIError) => void
}
export default ({ sellOffer, onSuccess, onError }: CheckFundingStatusEffectProps): EffectCallback =>
  () => {
    let abortCtrl: AbortController
    const checkingFunction = async () => {
      if (
        !sellOffer.id
        || !sellOffer.escrow
        || sellOffer.refunded
        || sellOffer.released
        || sellOffer.funding.status === 'FUNDED'
      ) return
      abortCtrl = getAbortWithTimeout(checkingInterval)

      info('Checking funding status of', sellOffer.id, sellOffer.escrow)

      const [result, err] = await getFundingStatus({
        offerId: sellOffer.id,
        abortSignal: abortCtrl.signal,
      })
      if (result) {
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
