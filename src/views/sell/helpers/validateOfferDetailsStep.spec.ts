import { missingSEPAData, paypalData, validSEPAData } from '../../../../tests/unit/data/paymentData'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { validateOfferDetailsStep } from './validateOfferDetailsStep'

describe('validateOfferDetailsStep', () => {
  beforeAll(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData)
    usePaymentDataStore.getState().addPaymentData(missingSEPAData)
  })
  it('should return false if offer has no amount', () => {
    const offer = { type: 'ask' }
    // @ts-expect-error
    expect(validateOfferDetailsStep(offer, {})).toBe(false)
  })
  it('should return false if offer has no means of payment configured', () => {
    const offer = { type: 'ask', amount: 210000, meansOfPayment: {} }
    // @ts-expect-error
    expect(validateOfferDetailsStep(offer, {})).toBe(false)
  })
  it('should return false if offer has no payment data configured', () => {
    const offer: Partial<SellOfferDraft> = {
      type: 'ask',
      amount: 210000,
      meansOfPayment: { EUR: ['sepa'] },
      paymentData: {},
    }
    // @ts-expect-error
    expect(validateOfferDetailsStep(offer, {})).toBe(false)
  })
  it('should return false if means of payment do not correspond with payment data', () => {
    const offer: Partial<SellOfferDraft> = {
      type: 'ask',
      amount: 210000,
      meansOfPayment: { EUR: ['sepa'] },
      paymentData: { paypal: { hashes: [] } },
    }
    // @ts-expect-error
    expect(validateOfferDetailsStep(offer, {})).toBe(false)
  })
  it('should return false if selected payment method have no info', () => {
    const offer: Partial<SellOfferDraft> = {
      type: 'ask',
      amount: 210000,
      meansOfPayment: { EUR: ['paypal'] },
      paymentData: { paypal: { hashes: [] } },
    }
    // @ts-expect-error
    expect(validateOfferDetailsStep(offer, { paypal: paypalData.id })).toBe(false)
  })
  it('should return false if payment data is invalid', () => {
    const offer: Partial<SellOfferDraft> = {
      type: 'ask',
      amount: 210000,
      meansOfPayment: { EUR: ['sepa'] },
      paymentData: { sepa: { hashes: [] } },
    }
    // @ts-expect-error
    expect(validateOfferDetailsStep(offer, { sepa: missingSEPAData.id })).toBe(false)
  })
  it('should return true if payment data is valid', () => {
    const offer: Partial<SellOfferDraft> = {
      type: 'ask',
      amount: 210000,
      meansOfPayment: { EUR: ['sepa'] },
      paymentData: { sepa: { hashes: [] } },
    }
    // @ts-expect-error
    expect(validateOfferDetailsStep(offer, { sepa: validSEPAData.id })).toBe(true)
  })
})
