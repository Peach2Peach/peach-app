import { getTradeSeparatorIconColor } from './getTradeSeparatorIconColor'

describe('getTradeSeparatorIconColor', () => {
  it('returns correct color when the dispute was won', () => {
    expect(getTradeSeparatorIconColor('buyer', 'buyer')).toEqual('#65A519')
  })
  it('returns correct color when the dispute was lost', () => {
    expect(getTradeSeparatorIconColor('buyer', 'seller')).toEqual('#DF321F')
  })
  it('returns correct color when there is no dispute winner', () => {
    expect(getTradeSeparatorIconColor('buyer')).toEqual('#7D675E')
  })
})
