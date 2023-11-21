import { validatePremiumStep } from './validatePremiumStep'

describe('validatePremiumStep', () => {
  const tradingLimit: Partial<TradingLimit> = { daily: 20 }
  const marketPrice: Pricebook = {
    CHF: 19,
  }

  it('should return false if the premium is more than 21 or less than -21', () => {
    const offer1: Partial<SellOfferDraft> = {
      premium: 22,
    }
    const offer2: Partial<SellOfferDraft> = {
      premium: -22,
    }
    expect(validatePremiumStep(offer1 as SellOfferDraft, marketPrice, tradingLimit as TradingLimit)).toBe(false)
    expect(validatePremiumStep(offer2 as SellOfferDraft, marketPrice, tradingLimit as TradingLimit)).toBe(false)
  })

  it('should return false if the marketPrice is not provided', () => {
    const offer: Partial<SellOfferDraft> = {
      premium: 1.5,
    }
    expect(validatePremiumStep(offer as SellOfferDraft, null, tradingLimit as TradingLimit)).toBe(false)
    expect(validatePremiumStep(offer as SellOfferDraft, undefined, tradingLimit as TradingLimit)).toBe(false)
  })

  it('should return true if the calculated price in CHF is less than the trading limit', () => {
    const offer1: Partial<SellOfferDraft> = {
      premium: 0,
      amount: 900000,
    }
    const marketPrice2: Pricebook = {
      CHF: 2000,
    }
    expect(validatePremiumStep(offer1 as SellOfferDraft, marketPrice2, tradingLimit as TradingLimit)).toBe(true)
  })

  it('should return true if the calculated price in CHF is equal to the trading limit', () => {
    const offer: Partial<SellOfferDraft> = {
      premium: 0,
      amount: 2000,
    }
    const marketPrice2: Pricebook = {
      CHF: 1000000,
    }

    expect(validatePremiumStep(offer as SellOfferDraft, marketPrice2, tradingLimit as TradingLimit)).toBe(true)
  })

  it('should return false if the calculated price in CHF is greater than the trading limit', () => {
    const offer1: Partial<SellOfferDraft> = {
      premium: 1,
      amount: 1000000,
    }
    const offer2: Partial<SellOfferDraft> = {
      premium: -2,
      amount: 1200000,
    }
    const marketPrice2: Pricebook = {
      CHF: 2000,
    }
    expect(validatePremiumStep(offer1 as SellOfferDraft, marketPrice2, tradingLimit as TradingLimit)).toBe(false)
    expect(validatePremiumStep(offer2 as SellOfferDraft, marketPrice2, tradingLimit as TradingLimit)).toBe(false)
  })
})
