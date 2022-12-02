import { ok } from 'assert'
import { somePaymentDataExists } from '../../../../src/utils/paymentMethod'
import { invalidSEPADataCurrency, missingSEPAData, validCashData, validSEPAData } from '../../data/paymentData'

describe('somePaymentDataExists', () => {
  it('checks if payment method is allowed for a given rcurrency', () => {
    ok(somePaymentDataExists(validSEPAData))
    ok(somePaymentDataExists(validCashData))
    ok(somePaymentDataExists(invalidSEPADataCurrency))
    ok(!somePaymentDataExists(missingSEPAData))
  })
})
