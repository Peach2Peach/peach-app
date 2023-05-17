import { getTradeSeparatorText } from './getTradeSeparatorText'

describe('getTradeSeparatorText', () => {
  it('returns correct text when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorText('tradeCanceled')).toEqual('trade canceled')
  })
  it('returns correct text when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorText('refundOrReviveRequired')).toEqual('dispute resolved')
  })
  it('returns correct text when tradeStatus is anything else', () => {
    expect(getTradeSeparatorText('tradeCompleted')).toEqual('trade completed')
  })
})
