import { getTradeSeparatorIconColor } from './getTradeSeparatorIconColor'

describe('getTradeSeparatorIconColor', () => {
  it('returns correct color when tradeStatus is refundOrReviveRequired', () => {
    expect(getTradeSeparatorIconColor('refundOrReviveRequired')).toEqual('#7D675E')
  })
  it('returns undefined when tradeStatus is anything else', () => {
    expect(getTradeSeparatorIconColor('tradeCompleted')).toEqual(undefined)
  })
})
