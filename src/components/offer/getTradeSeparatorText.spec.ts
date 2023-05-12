import { getTradeSeparatorText } from './getTradeSeparatorText'

describe('getTradeSeparatorText', () => {
  it('returns correct text when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorText('tradeCanceled')).toEqual('trade canceled')
  })
  it('returns correct text when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorText('refundOrReviveRequired')).toEqual('dispute resolved')
  })
  it('returns correct text when tradeStatus is tradeCompleted', () => {
    expect(getTradeSeparatorText('tradeCompleted')).toEqual('payment details')
  })
  it('returns correct text when tradeStatus is anything else', () => {
    // @ts-expect-error
    expect(getTradeSeparatorText('something else')).toEqual('trade completed')
  })
})
