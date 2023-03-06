export const getCompletedTrades = (contracts: ContractSummary[]) =>
  contracts.filter(({ tradeStatus }) => tradeStatus === 'tradeCompleted')
