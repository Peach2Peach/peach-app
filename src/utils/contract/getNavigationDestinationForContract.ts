import { queryClient } from '../../queryClient'
import { getContract } from '../peachAPI'

export const getNavigationDestinationForContract = async (
  contract: Contract | ContractSummary,
): Promise<['tradeComplete', { contract: Contract }] | ['contract', { contractId: string }]> => {
  if (contract.tradeStatus === 'rateUser') {
    const [fullContract] = await getContract({ contractId: contract.id })
    if (fullContract) {
      queryClient.setQueryData(['contract', contract.id], fullContract)
      return ['tradeComplete', { contract: fullContract }]
    }
  }
  return ['contract', { contractId: contract.id }]
}
