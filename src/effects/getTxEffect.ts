import { EffectCallback } from 'react'
import { getAbortWithTimeout } from '../utils/fetch'
import { error, info } from '../utils/log'
import { getTx } from '../utils/peachAPI'

const checkingInterval = 30 * 1000

type GetTxEffectProps = {
  txId: string
  onSuccess: (result: GetTxResponse) => void
  onError: (err: APIError) => void
}
export default ({ txId, onSuccess, onError }: GetTxEffectProps): EffectCallback =>
  () => {
    let interval: NodeJS.Timer
    let abortCtrl: AbortController

    const checkingFunction = async () => {
      abortCtrl = getAbortWithTimeout(checkingInterval)
      info('Check transaction ', txId)
      const [result, err] = await getTx({
        txId,
        abortSignal: abortCtrl.signal,
      })
      if (result) {
        info('Transaction result: ', JSON.stringify(result))
        onSuccess(result)
      } else if (err) {
        error('Error', err)
        onError(err)
      }
    }

    ;(() => {
      interval = setInterval(checkingFunction, checkingInterval)
      checkingFunction()
    })()

    return () => {
      abortCtrl?.abort()
      clearInterval(interval)
    }
  }
