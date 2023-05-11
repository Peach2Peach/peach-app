import { TradeSummaryProps } from './TradeSummary'

export const shouldShowDisputeStatus = (
  contract: Pick<TradeSummaryProps['contract'], 'tradeStatus' | 'disputeWinner'>,
): contract is TradeSummaryProps['contract'] & { disputeWinner: 'buyer' | 'seller' } =>
  ['refundOrReviveRequired', 'refundTxSignatureRequired'].includes(contract.tradeStatus) && !!contract.disputeWinner
