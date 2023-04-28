import { TradeSummaryProps } from './TradeSummary'

export const shouldShowDisputeStatus = (contract: TradeSummaryProps['contract']) =>
  contract.tradeStatus === 'refundOrReviveRequired' && !!contract.disputeWinner
