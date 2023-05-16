import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'

const isPaymentTooLateMock = jest.fn((..._args: any) => false)
jest.mock('./isPaymentTooLate', () => ({
  isPaymentTooLate: (...args: any) => isPaymentTooLateMock(...args),
}))

describe('getTradeSeparatorIcon', () => {
  const mockContract = {
    tradeStatus: 'tradeCompleted',
    paymentMade: null,
  } as Contract
  it('returns xCircle when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorIcon({ ...mockContract, tradeStatus: 'tradeCanceled' })).toEqual('xCircle')
  })

  it('returns alertOctagon when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorIcon({ ...mockContract, tradeStatus: 'refundOrReviveRequired' })).toEqual('alertOctagon')
  })

  it('returns undefined for tradeCompleted', () => {
    expect(getTradeSeparatorIcon({ ...mockContract, tradeStatus: 'tradeCompleted' })).toEqual(undefined)
  })

  it('returns undefined when tradeStatus is anything else', () => {
    // @ts-expect-error
    expect(getTradeSeparatorIcon({ ...mockContract, tradeStatus: 'somethingElse' })).toEqual(undefined)
  })
  it.todo('should return the correct icon if the seller won the dispute')
  it.todo('should return the correct icon if the seller lost the dispute')
  it.todo('should return the correct icon if the payment was too late')
  it.todo('should return the correct icon if the trade was canceled')
})
