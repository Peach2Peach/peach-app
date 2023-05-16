export const shouldShowDisputeStatus = (
  contract: Pick<Contract, 'tradeStatus' | 'disputeWinner'>,
): contract is Contract & { disputeWinner: 'buyer' | 'seller' } =>
  ['refundOrReviveRequired', 'refundTxSignatureRequired'].includes(contract.tradeStatus) && !!contract.disputeWinner
