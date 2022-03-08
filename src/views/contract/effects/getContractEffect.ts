import { EffectCallback } from 'react'
import { error, info } from '../../../utils/log'
import { getContract } from '../../../utils/peachAPI'

type GetContractEffectProps = {
  contractId: string,
  onSuccess: (result: GetContractResponse) => void,
  onError: (error: APIError) => void,
}

// TODO set interval?
export default ({
  contractId,
  onSuccess,
  onError
}: GetContractEffectProps): EffectCallback => () => {
  (async () => {
    if (!contractId) return

    info('Get contract info', contractId)

    const [result, err] = await getContract({
      contractId,
    })

    if (result) {
      onSuccess(result)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  })()
}