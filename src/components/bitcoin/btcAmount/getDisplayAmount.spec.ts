import { getDisplayAmount } from './getDisplayAmount'

describe('getDisplayAmount', () => {
  it('should return the correct display amount', () => {
    expect(getDisplayAmount(806496)).toEqual(['0.00', ' 806 496'])
  })
})
