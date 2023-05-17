import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'

describe('getTradeSeparatorIcon', () => {
  it('returns xCircle when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorIcon('tradeCanceled')).toEqual('xCircle')
  })

  it('returns alertOctagon when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorIcon('refundOrReviveRequired')).toEqual('alertOctagon')
  })

  it('returns calendar when tradeStatus is anything else', () => {
    expect(getTradeSeparatorIcon('tradeCompleted')).toEqual('calendar')
  })
})
