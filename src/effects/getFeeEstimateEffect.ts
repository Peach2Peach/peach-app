import { EffectCallback } from 'react'
import { getAbortWithTimeout } from '../utils/fetch'
import { error } from '../utils/log'
import { getFeeEstimate } from '../utils/peachAPI'

type GetFeeEstimateEffect = {
  interval?: number
  onSuccess: (result: FeeRecommendation) => void
  onError?: (err: APIError) => void
}
export default ({ interval, onSuccess, onError }: GetFeeEstimateEffect): EffectCallback =>
  () => {
    let intrvl: NodeJS.Timer
    let abortCtrl: AbortController
    const checkingFunction = async () => {
      abortCtrl = getAbortWithTimeout(interval)

      const [result, err] = await getFeeEstimate({
        abortSignal: abortCtrl.signal,
      })
      if (result) {
        onSuccess(result)
      } else if (err) {
        error('Error', err)
        if (onError) onError(err)
      }
    }

    checkingFunction()

    if (interval) {
      intrvl = setInterval(checkingFunction, interval)
    }

    return () => {
      abortCtrl?.abort()
      if (intrvl) clearInterval(intrvl)
    }
  }
