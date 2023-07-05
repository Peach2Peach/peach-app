import { isAmazonGiftCard } from './isAmazonGiftCard'

describe('isAmazonGiftCard', () => {
  it('returns true for amazon gift card', () => {
    expect(isAmazonGiftCard('giftCard.amazon')).toBe(true)
    expect(isAmazonGiftCard('giftCard.amazon.DE')).toBe(true)
  })
  it('returns false for non-amazon gift card', () => {
    expect(isAmazonGiftCard('sepa')).toBe(false)
  })
})
