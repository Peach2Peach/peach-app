import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getContract } from '../utils/peachAPI'

type GetContractEffectProps = {
  contractId: string,
  onSuccess: (result: GetContractResponse) => void,
  onError: (error: APIError) => void,
}

export default ({
  contractId,
  onSuccess,
  onError
}: GetContractEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    if (!contractId) return

    info('Get contract info', contractId)

    const [result, err] = await getContract({
      contractId,
    })

    if (result) {
      result.creationDate = new Date(result.creationDate)
      result.buyer.creationDate = new Date(result.buyer.creationDate)
      result.seller.creationDate = new Date(result.seller.creationDate)

      if (result.kycResponseDate) result.kycResponseDate = new Date(result.kycResponseDate)
      if (result.paymentMade) result.paymentMade = new Date(result.paymentMade)
      if (result.paymentConfirmed) result.paymentConfirmed = new Date(result.paymentConfirmed)

      onSuccess(result)
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