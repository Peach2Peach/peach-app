import { EffectCallback } from 'react'
import { getAbortWithTimeout } from '../utils/fetch'
import { error, info } from '../utils/log'
import { getContract } from '../utils/peachAPI'

const checkingInterval = 30 * 1000

type GetContractEffectProps = {
  contractId?: string
  onSuccess: (result: GetContractResponse) => void
  onError: (err: APIError) => void
}

export default ({ contractId, onSuccess, onError }: GetContractEffectProps): EffectCallback =>
  () => {
    let abortCtrl: AbortController
    const checkingFunction = async () => {
      if (!contractId) return
      abortCtrl = getAbortWithTimeout(checkingInterval)

      info('Get contract info', contractId)

      const [result, err] = await getContract({
        contractId,
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
