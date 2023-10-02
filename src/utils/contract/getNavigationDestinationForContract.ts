import { queryClient } from '../../queryClient'
import { peachAPI } from '../peachAPI'

export const getNavigationDestinationForContract = async (contract: {
  tradeStatus: Contract['tradeStatus']
  id: Contract['id']
}): Promise<['tradeComplete', { contract: Contract }] | ['contract', { contractId: string }]> => {
  if (contract.tradeStatus === 'rateUser') {
    const { result: fullContract } = await peachAPI.private.contract.getContract({ contractId: contract.id })
    if (fullContract) {
      queryClient.setQueryData(['contract', contract.id], fullContract)
      return ['tradeComplete', { contract: fullContract }]
    }
  }

  return ['contract', { contractId: contract.id }]
}
