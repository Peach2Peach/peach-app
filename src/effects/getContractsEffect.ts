import { EffectCallback } from 'react'
import { error, info } from '../utils/log'
import { getContracts } from '../utils/peachAPI'

type GetContractsEffectProps = {
  onSuccess: (result: GetContractsResponse) => void,
  onError: (err: APIError) => void,
}

export default ({
  onSuccess,
  onError
}: GetContractsEffectProps): EffectCallback => () => {
  const checkingFunction = async () => {
    info('Get contracts info')

    const [result, err] = await getContracts()

    if (result) {
      const contracts = result.map(contract => {
        contract.creationDate = new Date(contract.creationDate)
        contract.buyer.creationDate = new Date(contract.buyer.creationDate)
        contract.seller.creationDate = new Date(contract.seller.creationDate)

        if (contract.kycResponseDate) contract.kycResponseDate = new Date(contract.kycResponseDate)
        if (contract.paymentMade) contract.paymentMade = new Date(contract.paymentMade)
        if (contract.paymentConfirmed) contract.paymentConfirmed = new Date(contract.paymentConfirmed)
      })

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