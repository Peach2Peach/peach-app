import { getTradeSeparatorText } from './getTradeSeparatorText'

describe('getTradeSeparatorText', () => {
  it('returns correct text when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorText('tradeCanceled', 'sepa', 'buyer')).toEqual('trade canceled')
  })
  it('returns correct text when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorText('refundOrReviveRequired', 'sepa', 'buyer')).toEqual('dispute resolved')
  })
  it('returns correct text for completed trade for the buyer', () => {
    expect(getTradeSeparatorText('tradeCompleted', 'sepa', 'buyer')).toEqual('trade details')
  })
  it('returns correct text when tradeStatus is tradeCompleted for the seller', () => {
    expect(getTradeSeparatorText('tradeCompleted', 'sepa', 'seller')).toEqual('sepa payment details')
  })
  it('returns correct text when tradeStatus is anything else', () => {
    // @ts-expect-error
    expect(getTradeSeparatorText('something else', 'sepa', 'buyer')).toEqual('sepa payment details')
  })
})
