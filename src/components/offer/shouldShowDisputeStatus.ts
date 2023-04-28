import { TradeSummaryProps } from './TradeSummary'

export const shouldShowDisputeStatus = (
  contract: TradeSummaryProps['contract'],
): contract is TradeSummaryProps['contract'] & { disputeWinner: 'buyer' | 'seller' } =>
  ['refundOrReviveRequired', 'refundTxSignatureRequired'].includes(contract.tradeStatus) && !!contract.disputeWinner
