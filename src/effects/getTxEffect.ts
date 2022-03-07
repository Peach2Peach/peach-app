import { EffectCallback } from 'react'
import { error, info } from '../utils/logUtils'
import { getTx } from '../utils/peachAPI'

type GetTxEffectProps = {
  txId: string,
  onSuccess: (result: GetTxResponse) => void,
  onError: (error: APIError) => void,
}
export default ({
  txId,
  onSuccess,
  onError
}: GetTxEffectProps): EffectCallback => () => {
  let interval: NodeJS.Timer

  const checkingFunction = async () => {
    info('Check transaction ', txId)
    const [result, err] = await getTx({
      txId,
    })
    if (result) {
      info('Transaction result: ', JSON.stringify(result))
      onSuccess(result)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  }

  (() => {
    interval = setInterval(checkingFunction, 60 * 1000)
    checkingFunction()
  })()

  return () => {
    clearInterval(interval)
  }
}
