import { ok } from 'assert'
import { isValidPaymentData } from '../../../../src/utils/paymentMethod'
import { invalidSEPADataCurrency, missingSEPAData, validCashData, validSEPAData } from '../../data/paymentData'

describe('isValidPaymentData', () => {
  it('checks if at least non metadata payment data exists', () => {
    ok(isValidPaymentData(validSEPAData))
    ok(isValidPaymentData(validCashData))
    ok(!isValidPaymentData(invalidSEPADataCurrency))
    ok(!isValidPaymentData(missingSEPAData))
  })
})
