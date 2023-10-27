export const getNavigationDestinationForContract = ({
  tradeStatus,
  id: contractId,
}: Pick<Contract | ContractSummary, 'tradeStatus' | 'id'>) => [
  tradeStatus === 'rateUser' ? 'tradeComplete' : 'contract',
  { contractId },
]
