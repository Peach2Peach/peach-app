import { getTradeSeparatorText } from './getTradeSeparatorText'

describe('getTradeSeparatorText', () => {
  it('returns correct text when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorText('tradeCanceled', 'sepa')).toEqual('trade canceled')
  })
  it('returns correct text when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorText('refundOrReviveRequired', 'sepa')).toEqual('dispute resolved')
  })
  it('returns correct text when tradeStatus is tradeCompleted', () => {
    expect(getTradeSeparatorText('tradeCompleted', 'sepa')).toEqual('sepa payment details')
  })
  it('returns correct text when tradeStatus is anything else', () => {
    // @ts-expect-error
    expect(getTradeSeparatorText('something else', 'sepa')).toEqual('trade completed')
  })
})
