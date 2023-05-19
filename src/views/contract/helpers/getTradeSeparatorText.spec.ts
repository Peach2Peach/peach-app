import { getTradeSeparatorText } from './getTradeSeparatorText'

const isPaymentTooLateMock = jest.fn(() => false)
jest.mock('../../../utils/contract/status/isPaymentTooLate', () => ({
  isPaymentTooLate: (_contract: any) => isPaymentTooLateMock(),
}))

describe('getTradeSeparatorText', () => {
  const mockContract = {
    tradeStatus: 'tradeCompleted',
    paymentMade: Date(),
  } as unknown as Contract

  it('returns "dispute won" if the viewer won the dispute', () => {
    expect(getTradeSeparatorText({ ...mockContract, disputeWinner: 'buyer' }, 'buyer')).toEqual('dispute won')
    expect(getTradeSeparatorText({ ...mockContract, disputeWinner: 'seller' }, 'seller')).toEqual('dispute won')
  })
  it('returns "dispute lost" if the viewer lost the dispute', () => {
    expect(getTradeSeparatorText({ ...mockContract, disputeWinner: 'buyer' }, 'seller')).toEqual('dispute lost')
    expect(getTradeSeparatorText({ ...mockContract, disputeWinner: 'seller' }, 'buyer')).toEqual('dispute lost')
  })

  it('returns "buyer canceled" if the buyer canceled the trade and the viewer is the seller', () => {
    expect(getTradeSeparatorText({ ...mockContract, canceledBy: 'buyer' }, 'seller')).toEqual('buyer canceled')
    expect(getTradeSeparatorText({ ...mockContract, canceledBy: 'buyer' }, 'buyer')).not.toEqual('buyer canceled')
  })

  it('returns "payment too late" if the payment is too late and the viewer is the seller', () => {
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(getTradeSeparatorText(mockContract, 'seller')).toEqual('payment too late')
  })
  it('returns "payment too late" if the payment is too late, the viewer is the buyer and contract is canceled', () => {
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(getTradeSeparatorText({ ...mockContract, canceled: true }, 'buyer')).toEqual('payment too late')
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(getTradeSeparatorText({ ...mockContract, canceled: false }, 'buyer')).not.toEqual('payment too late')
  })

  it('returns correct text if seller requested cancelation, viewer is buyer and contract isn\'t canceled', () => {
    expect(getTradeSeparatorText({ ...mockContract, cancelationRequested: true }, 'buyer')).toEqual(
      'seller wants to cancel',
    )
    expect(getTradeSeparatorText({ ...mockContract, cancelationRequested: true, canceled: true }, 'buyer')).not.toEqual(
      'seller wants to cancel',
    )
  })

  it('returns "trade canceled" in all other non-standard cases', () => {
    expect(getTradeSeparatorText({ ...mockContract, canceled: true }, 'seller')).toEqual('trade canceled')
  })

  it('returns "trade details" for completed buy trades', () => {
    expect(getTradeSeparatorText({ ...mockContract, tradeStatus: 'tradeCompleted' }, 'buyer')).toEqual('trade details')
  })

  it('returns "payment details" in all other cases', () => {
    expect(getTradeSeparatorText(mockContract, 'seller')).toEqual('payment details')
  })
})
