import { isCanceledOffer } from '../../../../../src/views/offerDetails/helpers/isCanceledOffer'

describe('isCanceledOffer', () => {
  it('should return true if tradeStatus is offerCanceled', () => {
    expect(isCanceledOffer({ tradeStatus: 'offerCanceled' } as BuyOffer | SellOffer)).toBe(true)
  })

  it('should return false if tradeStatus is not offerCanceled', () => {
    expect(isCanceledOffer({ tradeStatus: 'tradeCompleted' } as BuyOffer | SellOffer)).toBe(false)
  })

  it('should return false if the offer is null', () => {
    expect(isCanceledOffer(null)).toBe(false)
  })

  it('should return false if the offer is undefined', () => {
    expect(isCanceledOffer(undefined)).toBe(false)
  })
})
