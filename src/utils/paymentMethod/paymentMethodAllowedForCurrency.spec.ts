import { ok } from 'assert'
import { paymentMethodAllowedForCurrency } from './paymentMethodAllowedForCurrency'

describe('paymentMethodAllowedForCurrency', () => {
  it('checks if payment method is allowed for a given rcurrency', () => {
    ok(paymentMethodAllowedForCurrency('sepa', 'EUR'))
    ok(!paymentMethodAllowedForCurrency('sepa', 'CHF'))
    ok(!paymentMethodAllowedForCurrency('sepa', 'GBP'))
    ok(!paymentMethodAllowedForCurrency('sepa', 'SEK'))
  })
})
