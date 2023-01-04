import { EffectCallback } from 'react'
import { getAbortWithTimeout } from '../utils/fetch'
import { error, info } from '../utils/log'
import { getContracts } from '../utils/peachAPI'

const checkingInterval = 60 * 1000

type GetContractsEffectProps = {
  onSuccess: (result: GetContractsResponse) => void
  onError: (err: APIError) => void
}

export default ({ onSuccess, onError }: GetContractsEffectProps): EffectCallback =>
  () => {
    let abortCtrl: AbortController
    const checkingFunction = async () => {
      abortCtrl = getAbortWithTimeout(checkingInterval)
      info('Get contracts info')

      const [result, err] = await getContracts({ abortSignal: abortCtrl.signal })

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
