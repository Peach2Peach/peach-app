import { shouldShowDisputeStatus } from './shouldShowDisputeStatus'

describe('shouldShowDisputeStatus', () => {
  it('returns true when tradeStatus is refundOrReviveRequired and there is a disputeWinner', () => {
    expect(
      shouldShowDisputeStatus({
        tradeStatus: 'refundOrReviveRequired',
        disputeWinner: 'buyer',
      }),
    ).toEqual(true)
  })
  it('returns true when tradeStatus is refundTxSignatureRequired and there is a disputeWinner', () => {
    expect(
      shouldShowDisputeStatus({
        tradeStatus: 'refundTxSignatureRequired',
        disputeWinner: 'buyer',
      }),
    ).toEqual(true)
  })
  it('returns false when there is no disputeWinner', () => {
    expect(
      shouldShowDisputeStatus({
        tradeStatus: 'refundOrReviveRequired',
        disputeWinner: undefined,
      }),
    ).toEqual(false)
  })
  it('returns false when tradeStatus is anything else', () => {
    expect(
      shouldShowDisputeStatus({
        tradeStatus: 'tradeCompleted',
        disputeWinner: 'buyer',
      }),
    ).toEqual(false)
  })
})
