import { TradeTheme } from './getThemeForTradeItem'
import { wonDisputeForTrade } from './wonDisputeForTrade'

export const getDisputeResultTheme = (trade: Pick<ContractSummary, 'disputeWinner' | 'type'>): TradeTheme => {
  const isWonDispute = wonDisputeForTrade(trade)
  return {
    iconId: 'alertOctagon',
    color: isWonDispute ? 'success' : 'error',
  }
}
