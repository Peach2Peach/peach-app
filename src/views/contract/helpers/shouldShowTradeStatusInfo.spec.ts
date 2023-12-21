import { contract } from '../../../../peach-api/src/testData/contract'
import { shouldShowTradeStatusInfo } from './shouldShowTradeStatusInfo'

const isPaymentTooLateMock = jest.fn((..._args: unknown[]) => false)
jest.mock('../../../utils/contract/status/isPaymentTooLate', () => ({
  isPaymentTooLate: (...args: unknown[]) => isPaymentTooLateMock(...args),
}))

describe('shouldShowTradeStatusInfo', () => {
  const mockContract = {
    ...contract,
    paymentMade: null,
    disputeWinner: undefined,
    canceled: false,
    cancelationRequested: false,
    tradeStatus: 'tradeCompleted' as const,
  }
  it('should return false by default', () => {
    expect(shouldShowTradeStatusInfo(mockContract, 'seller')).toEqual(false)
  })
  it('should return true if there is a cancelationRequested and view is buyer', () => {
    expect(shouldShowTradeStatusInfo({ ...mockContract, cancelationRequested: true }, 'buyer')).toEqual(true)
  })
  it('should return false if there is a cancelationRequested and view is seller', () => {
    expect(shouldShowTradeStatusInfo({ ...mockContract, cancelationRequested: true }, 'seller')).toEqual(false)
  })
  it('should return true if the contract is canceled', () => {
    expect(shouldShowTradeStatusInfo({ ...mockContract, canceled: true }, 'seller')).toEqual(true)
  })
  it('should return true if the payment is too late and view is seller', () => {
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(shouldShowTradeStatusInfo(mockContract, 'seller')).toEqual(true)
  })
  it('should return true if the payment is too late and view is buyer', () => {
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(shouldShowTradeStatusInfo(mockContract, 'buyer')).toEqual(true)
  })
  it('should return true if the buyer won and the escrow isnt paid out', () => {
    expect(
      shouldShowTradeStatusInfo({ ...mockContract, disputeWinner: 'buyer', tradeStatus: 'releaseEscrow' }, 'seller'),
    ).toEqual(true)
    expect(
      shouldShowTradeStatusInfo(
        { ...mockContract, disputeWinner: 'buyer', tradeStatus: 'confirmPaymentRequired' },
        'buyer',
      ),
    ).toEqual(true)
    expect(
      shouldShowTradeStatusInfo({ ...mockContract, disputeWinner: 'buyer', tradeStatus: 'releaseEscrow' }, 'seller'),
    ).toEqual(true)
    expect(
      shouldShowTradeStatusInfo(
        { ...mockContract, disputeWinner: 'buyer', tradeStatus: 'confirmPaymentRequired' },
        'buyer',
      ),
    ).toEqual(true)
  })
})
