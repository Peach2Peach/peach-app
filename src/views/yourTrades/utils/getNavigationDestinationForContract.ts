import { getContract } from '../../../utils/contract'

export const getNavigationDestinationForContract = (contract: ContractSummary): [string, object | undefined] => {
  if (contract.tradeStatus === 'rateUser') {
    const fullContract = getContract(contract.id)
    if (fullContract) return ['tradeComplete', { contract: fullContract }]
  }

  return ['contract', { contractId: contract.id }]
}
