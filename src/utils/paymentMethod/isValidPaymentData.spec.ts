import { ok } from 'assert'
import { isValidPaymentData } from '.'
import {
  invalidSEPADataCurrency,
  missingSEPAData,
  validCashData,
  validSEPAData,
} from '../../../tests/unit/data/paymentData'

describe('isValidPaymentData', () => {
  it('checks if at least non metadata payment data exists', () => {
    ok(isValidPaymentData(validSEPAData))
    ok(isValidPaymentData(validCashData))
    ok(!isValidPaymentData(invalidSEPADataCurrency))
    ok(!isValidPaymentData(missingSEPAData))
  })
})
