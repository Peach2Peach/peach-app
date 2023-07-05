import { twintData, validSEPAData } from '../../../tests/unit/data/paymentData'
import { getPaymentDataInfoFields } from './getPaymentDataInfoFields'

describe('getPaymentDataInfoFields', () => {
  it('should return relevant payment data fields', () => {
    expect(getPaymentDataInfoFields(validSEPAData)).toEqual([
      {
        field: 'beneficiary',
        value: 'Hal Finney',
      },
      {
        field: 'bic',
        value: 'AAAA BB CC 123',
      },
      {
        field: 'iban',
        value: 'IE29 AIBK 9311 5212 3456 78',
      },
    ])
    expect(getPaymentDataInfoFields(twintData)).toEqual([
      {
        field: 'phone',
        value: '+341234875987',
      },
    ])
  })
})
