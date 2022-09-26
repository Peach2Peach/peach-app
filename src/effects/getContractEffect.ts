import { EffectCallback } from 'react'
import { parseContract } from '../utils/contract'
import { error, info } from '../utils/log'
import { getContract } from '../utils/peachAPI'

type GetContractEffectProps = {
  contractId?: string
  onSuccess: (result: GetContractResponse) => void
  onError: (err: APIError) => void
}

export default ({ contractId, onSuccess, onError }: GetContractEffectProps): EffectCallback =>
  () => {
    const checkingFunction = async () => {
      if (!contractId) return

      info('Get contract info', contractId)

      const [result, err] = await getContract({
        contractId,
      })

      if (result) {
        onSuccess(parseContract(result))
      } else if (err) {
        error('Error', err)
        onError(err)
      }
    }

    const interval = setInterval(checkingFunction, 30 * 1000)
    checkingFunction()

    return () => {
      clearInterval(interval)
    }
  }
