export const wonDisputeForTrade = (trade: ContractSummary) =>
  (trade.disputeWinner === 'seller' && trade.type === 'ask') || (trade.disputeWinner === 'buyer' && trade.type === 'bid')
