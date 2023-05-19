import { getTradeActionStatusText } from './getTradeActionStatusText'

jest.mock('./getBuyerStatusText', () => ({
  getBuyerStatusText: jest.fn(() => 'buyer status text'),
}))
jest.mock('./getSellerStatusText', () => ({
  getSellerStatusText: jest.fn(() => 'seller status text'),
}))

describe('getTradeActionStatusText', () => {
  it('should return the correct text for the buyer', () => {
    expect(getTradeActionStatusText({} as Contract, 'buyer')).toBe('buyer status text')
  })
  it('should return the correct text for the seller', () => {
    expect(getTradeActionStatusText({} as Contract, 'seller')).toBe('seller status text')
  })
})
