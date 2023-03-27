import { getBuyOfferDraft } from './getBuyOfferDraft'

describe('getBuyOfferDraft', () => {
  it('should return a BuyOfferDraft', () => {
    expect(
      getBuyOfferDraft({
        minBuyAmount: 100,
        maxBuyAmount: 1000,
      }),
    ).toEqual({
      type: 'bid',
      creationDate: expect.any(Date),
      lastModified: expect.any(Date),
      amount: [100, 1000],
      meansOfPayment: {},
      paymentData: {},
      releaseAddress: '',
      originalPaymentData: [],
    })
  })
  it('should return a BuyOfferDraft with meansOfPayment set', () => {
    expect(
      getBuyOfferDraft({
        minBuyAmount: 100,
        maxBuyAmount: 1000,
        meansOfPayment: { EUR: ['sepa'] },
      }),
    ).toEqual({
      type: 'bid',
      creationDate: expect.any(Date),
      lastModified: expect.any(Date),
      amount: [100, 1000],
      meansOfPayment: { EUR: ['sepa'] },
      paymentData: {},
      releaseAddress: '',
      originalPaymentData: [],
    })
  })
})
