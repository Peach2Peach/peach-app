import { getContract } from '../../../../utils/peachAPI'

export const getNavigationDestinationForContract = async (
  contract: Contract | ContractSummary,
): Promise<
  | ['setRefundWallet', { offerId: string }]
  | ['tradeComplete', { contract: Contract }]
  | ['contract', { contractId: string }]
> => {
  if (contract.tradeStatus === 'rateUser') {
    const [fullContract] = await getContract({ contractId: contract.id })
    if (fullContract) return ['tradeComplete', { contract: fullContract }]
  }

  return ['contract', { contractId: contract.id }]
}
