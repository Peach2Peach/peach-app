export const wonDisputeForTrade = (trade: Pick<ContractSummary, 'disputeWinner' | 'type'>) =>
  (trade.disputeWinner === 'seller' && trade.type === 'ask') || (trade.disputeWinner === 'buyer' && trade.type === 'bid')
