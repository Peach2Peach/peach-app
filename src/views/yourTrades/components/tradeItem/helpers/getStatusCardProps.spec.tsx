import { getStatusCardProps } from './getStatusCardProps'

const mockItem: TradeSummary = {
  amount: 21,
  creationDate: new Date('2021-08-01'),
  currency: 'EUR',
  id: '21',
  type: 'ask',
  lastModified: new Date('2021-08-01'),
  matches: [],
  prices: {
    EUR: 21,
  },
  tradeStatus: 'waiting',
}

describe('getStatusCardProps', () => {
  it('should return an object with the right keys', () => {
    const result = getStatusCardProps(mockItem, jest.fn(), jest.fn())
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('icon')
    expect(result).toHaveProperty('subtext')
    expect(result).toHaveProperty('amount')
    expect(result).toHaveProperty('price')
    expect(result).toHaveProperty('currency')
    expect(result).toHaveProperty('label')
    expect(result).toHaveProperty('labelIcon')
    expect(result).toHaveProperty('onPress')
    expect(result).toHaveProperty('unreadMessages')
    expect(result).toHaveProperty('color')
  })
})
