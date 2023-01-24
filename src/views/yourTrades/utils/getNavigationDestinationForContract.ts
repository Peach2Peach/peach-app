import { getContract, getOfferIdFromContract } from '../../../utils/contract'

export const getNavigationDestinationForContract = (contract: ContractSummary): [string, object | undefined] => {
  if (contract.tradeStatus === 'rateUser') {
    const fullContract = getContract(contract.id)
    if (fullContract) return ['tradeComplete', { contract: fullContract }]
  }
  if (contract.tradeStatus === 'tradeCompleted') {
    const fullContract = getContract(contract.id)
    if (fullContract) return ['offer', { offerId: getOfferIdFromContract(fullContract) }]
  }
  return ['contract', { contractId: contract.id }]
}
