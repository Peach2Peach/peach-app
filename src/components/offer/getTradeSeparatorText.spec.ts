import { getTradeSeparatorText } from './getTradeSeparatorText'

describe('getTradeSeparatorText', () => {
  const mockContract = {
    tradeStatus: 'tradeCompleted',
    paymentMade: Date(),
  } as unknown as Contract
  it.todo('returns correct text when buyer canceled')
  it('returns correct text when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorText({ ...mockContract, tradeStatus: 'tradeCanceled' }, 'buyer')).toEqual('trade canceled')
  })
  it.todo('returns correct text when payment is too late')
  it.todo('returns correct text when dispute was won')
  it.todo('returns correct text when dispute was lost')
  it.todo('returns correct text when seller requested cancelation')
  it('returns correct text when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorText({ ...mockContract, tradeStatus: 'refundOrReviveRequired' }, 'buyer')).toEqual(
      'dispute resolved',
    )
  })
  it('returns correct text for completed trade for the buyer', () => {
    expect(getTradeSeparatorText({ ...mockContract, tradeStatus: 'tradeCompleted' }, 'buyer')).toEqual('trade details')
  })
  it('returns correct text when tradeStatus is tradeCompleted for the seller', () => {
    expect(getTradeSeparatorText({ ...mockContract, tradeStatus: 'tradeCompleted' }, 'seller')).toEqual(
      'payment details',
    )
  })
  it('returns correct text when tradeStatus is anything else', () => {
    // @ts-expect-error
    expect(getTradeSeparatorText({ ...mockContract, tradeStatus: 'something else' }, 'buyer')).toEqual('payment details')
  })
})
