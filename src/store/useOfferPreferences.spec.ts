import { defaultFundingStatus } from '../utils/offer/constants'
import { useOfferPreferences } from './useOfferPreferences'

describe('useOfferPreferences - store', () => {
  it('should return a store', () => {
    expect(useOfferPreferences).toBeDefined()
  })
  it('should have buy and sell keys', () => {
    expect(useOfferPreferences.getState()).toHaveProperty('buyPreferences')
    expect(useOfferPreferences.getState()).toHaveProperty('sellPreferences')
  })
  it('should have the correct default values', () => {
    expect(useOfferPreferences.getState().buyPreferences).toStrictEqual({
      type: 'bid',
      amount: [0, Infinity],
      meansOfPayment: {},
      paymentData: {},
      releaseAddress: '',
      originalPaymentData: [],
    })
    expect(useOfferPreferences.getState().sellPreferences).toStrictEqual({
      type: 'ask',
      tradeStatus: 'fundEscrow',
      premium: 1.5,
      meansOfPayment: {},
      paymentData: {},
      originalPaymentData: [],
      funding: {
        amounts: [],
        expiry: 4320,
        status: 'NULL',
        txIds: [],
        vouts: [],
      },
      amount: 0,
      returnAddress: '',
    })
  })
})

describe('useOfferPreferences - actions - buyPreferences', () => {
  it('should update the buy preferences', () => {
    const newPreferences: BuyOfferDraft = {
      type: 'bid',
      amount: [50000, 3200000],
      meansOfPayment: {},
      paymentData: {},
      releaseAddress: '',
      originalPaymentData: [],
    }
    useOfferPreferences.getState().updateBuyPreferences(newPreferences)
    expect(useOfferPreferences.getState().buyPreferences).toStrictEqual(newPreferences)
  })
  it('should merge existing buy preferences with new preferences', () => {
    const newPreferences: Partial<BuyOfferDraft> = {
      amount: [50000, 3200000],
    }
    useOfferPreferences.getState().updateBuyPreferences(newPreferences)
    expect(useOfferPreferences.getState().buyPreferences).toStrictEqual({
      type: 'bid',
      amount: [50000, 3200000],
      meansOfPayment: {},
      paymentData: {},
      releaseAddress: '',
      originalPaymentData: [],
    })
  })
})

describe('useOfferPreferences - actions - sellPreferences', () => {
  it('should update the sell preferences', () => {
    const newPreferences: SellOfferDraft = {
      type: 'ask',
      tradeStatus: 'fundEscrow',
      premium: 1.5,
      meansOfPayment: {},
      paymentData: {},
      originalPaymentData: [],
      funding: defaultFundingStatus,
      amount: 0,
      returnAddress: '',
    }
    useOfferPreferences.getState().updateSellPreferences(newPreferences)
    expect(useOfferPreferences.getState().sellPreferences).toStrictEqual(newPreferences)
  })
  it('should merge existing sell preferences with new preferences', () => {
    const newPreferences = {
      amount: 210000,
    }
    useOfferPreferences.getState().updateSellPreferences(newPreferences)
    expect(useOfferPreferences.getState().sellPreferences).toStrictEqual({
      type: 'ask',
      tradeStatus: 'fundEscrow',
      premium: 1.5,
      meansOfPayment: {},
      paymentData: {},
      originalPaymentData: [],
      funding: defaultFundingStatus,
      amount: 210000,
      returnAddress: '',
    })
  })
})
