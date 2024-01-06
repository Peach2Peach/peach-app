import { ContractSummary } from '../../../../peach-api/src/@types/contract'
import { TradeTheme } from './getThemeForTradeItem'

export const getDisputeResultTheme = ({
  disputeWinner,
  type,
}: Pick<ContractSummary, 'disputeWinner' | 'type'>): TradeTheme => {
  const isWonDispute = (disputeWinner === 'seller' && type === 'ask') || (disputeWinner === 'buyer' && type === 'bid')
  return {
    iconId: 'alertOctagon',
    color: isWonDispute ? 'success' : 'error',
  }
}
