import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getContracts } from '../utils/peachAPI'

type GetContractsEffectProps = {
  onSuccess: (result: GetContractsResponse) => void
  onError: (err: APIError) => void
}

export default ({ onSuccess, onError }: GetContractsEffectProps): EffectCallback =>
  () => {
    const checkingInternval = 60 * 1000
    const checkingFunction = async () => {
      info('Get contracts info')

      const [result, err] = await getContracts({ timeout: checkingInternval })

      if (result) {
        onSuccess(result)
      } else if (err) {
        error('Error', err)
        onError(err)
      }
    }

    const interval = setInterval(checkingFunction, checkingInternval)
    checkingFunction()

    return () => {
      clearInterval(interval)
    }
  }
