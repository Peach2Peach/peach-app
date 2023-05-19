import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'

const isPaymentTooLateMock = jest.fn((..._args: any) => false)
jest.mock('../../../utils/contract/status/isPaymentTooLate', () => ({
  isPaymentTooLate: (...args: any) => isPaymentTooLateMock(...args),
}))

describe('getTradeSeparatorIcon', () => {
  const mockContract = {
    tradeStatus: 'tradeCompleted',
    paymentMade: null,
  } as Contract
  it('should return a clock if the payment was too late and the view is the seller', () => {
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(getTradeSeparatorIcon(mockContract, 'seller')).toEqual('clock')
  })
  it('should return undefined if the payment was too late and the view is the buyer', () => {
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(getTradeSeparatorIcon(mockContract, 'buyer')).toEqual(undefined)
  })
  it('should return a clock if the payment was too late and the contract is canceled', () => {
    isPaymentTooLateMock.mockReturnValueOnce(true)
    expect(getTradeSeparatorIcon({ ...mockContract, canceled: true }, 'buyer')).toEqual('clock')
  })
  it('should return the correct icon if there is a dispute winner', () => {
    expect(getTradeSeparatorIcon({ ...mockContract, disputeWinner: 'seller' }, 'seller')).toEqual('alertCircle')
    expect(getTradeSeparatorIcon({ ...mockContract, disputeWinner: 'seller' }, 'buyer')).toEqual('alertCircle')
    expect(getTradeSeparatorIcon({ ...mockContract, disputeWinner: 'buyer' }, 'seller')).toEqual('alertCircle')
    expect(getTradeSeparatorIcon({ ...mockContract, disputeWinner: 'buyer' }, 'buyer')).toEqual('alertCircle')
  })

  it('should return xCircle for all other non standard cases', () => {
    expect(getTradeSeparatorIcon({ ...mockContract, canceled: true }, 'seller')).toEqual('xCircle')
    expect(getTradeSeparatorIcon({ ...mockContract, canceled: true }, 'buyer')).toEqual('xCircle')
    expect(getTradeSeparatorIcon({ ...mockContract, cancelationRequested: true }, 'seller')).toEqual(undefined)
    expect(getTradeSeparatorIcon({ ...mockContract, cancelationRequested: true }, 'buyer')).toEqual('xCircle')
  })

  it('should return undefined otherwise', () => {
    expect(getTradeSeparatorIcon(mockContract, 'seller')).toEqual(undefined)
    expect(getTradeSeparatorIcon(mockContract, 'buyer')).toEqual(undefined)
  })
})
