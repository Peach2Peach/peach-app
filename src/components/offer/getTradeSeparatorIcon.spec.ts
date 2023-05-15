import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'

describe('getTradeSeparatorIcon', () => {
  it('returns xCircle when tradeStatus is tradeCanceled', () => {
    expect(getTradeSeparatorIcon('tradeCanceled')).toEqual('xCircle')
  })

  it('returns alertOctagon when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorIcon('refundOrReviveRequired')).toEqual('alertOctagon')
  })

  it('returns undefined for tradeCompleted', () => {
    expect(getTradeSeparatorIcon('tradeCompleted')).toEqual(undefined)
  })

  it('returns undefined when tradeStatus is anything else', () => {
    // @ts-expect-error
    expect(getTradeSeparatorIcon('somethingElse')).toEqual(undefined)
  })
})
