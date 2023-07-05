import { twintData, twintDataHashes, validSEPAData, validSEPADataHashes } from '../../../tests/unit/data/paymentData'
import { hashPaymentData } from './hashPaymentData'

describe('hashPaymentData', () => {
  it('should hash every relevant payment data field', () => {
    expect(hashPaymentData(validSEPAData)).toEqual(validSEPADataHashes)
    expect(hashPaymentData(twintData)).toEqual(twintDataHashes)
  })
  it('does not hash irrelevant data', () => {
    expect(hashPaymentData({ id: 'test', label: 'label', type: 'sepa', currencies: ['EUR'] })).toEqual([])
  })
})
