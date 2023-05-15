import { getTradeSeparatorText } from './getTradeSeparatorText'

describe('getTradeSeparatorText', () => {
  it('returns correct text when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorText('tradeCanceled', 'buyer')).toEqual('trade canceled')
  })
  it('returns correct text when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorText('refundOrReviveRequired', 'buyer')).toEqual('dispute resolved')
  })
  it('returns correct text for completed trade for the buyer', () => {
    expect(getTradeSeparatorText('tradeCompleted', 'buyer')).toEqual('trade details')
  })
  it('returns correct text when tradeStatus is tradeCompleted for the seller', () => {
    expect(getTradeSeparatorText('tradeCompleted', 'seller')).toEqual('payment details')
  })
  it('returns correct text when tradeStatus is anything else', () => {
    // @ts-expect-error
    expect(getTradeSeparatorText('something else', 'buyer')).toEqual('payment details')
  })
})
