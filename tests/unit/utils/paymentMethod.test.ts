import { deepStrictEqual, ok } from 'assert'
import {
  getMoPsInCommon,
  getPaymentMethods,
  getCurrencies,
  paymentMethodAllowedForCurrency
} from '../../../src/utils/paymentMethod'

const mopsA: MeansOfPayment = {
  'EUR': ['sepa', 'paypal', 'revolut'],
  'CHF': ['sepa'],
  'GBP': ['sepa'],
}
const mopsB: MeansOfPayment = {
  'EUR': ['paypal', 'wise'],
  'CHF': ['revolut'],
}
const mopsC: MeansOfPayment = {
  'EUR': ['paypal', 'revolut'],
}
const mopsD: MeansOfPayment = {
  'EUR': ['paypal'],
  'CHF': ['paypal'],
}
const mopsE: MeansOfPayment = {
  'EUR': ['wise', 'sepa']
}
const mopsF: MeansOfPayment = {
  'CHF': ['sepa', 'wise'],
  'EUR': ['sepa'], 'GBP': ['sepa']
}

describe('getMoPsInCommon', () => {
  it('finds payment methods that both offers have in common', () => {
    deepStrictEqual(getMoPsInCommon(mopsA, mopsB), {
      'EUR': ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsA, mopsC), {
      'EUR': ['paypal', 'revolut'],
    })
    deepStrictEqual(getMoPsInCommon(mopsA, mopsD), {
      'EUR': ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsB, mopsC), {
      'EUR': ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsB, mopsD), {
      'EUR': ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsC, mopsD), {
      'EUR': ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsE, mopsF), {
      'EUR': ['sepa'],
    })
  })
})

describe('getPaymentMethods', () => {
  it('gets all payment methods defined in means of payment', () => {
    deepStrictEqual(getPaymentMethods(mopsA), ['sepa', 'paypal', 'revolut'])
    deepStrictEqual(getPaymentMethods(mopsB), ['paypal', 'wise', 'revolut'])
    deepStrictEqual(getPaymentMethods(mopsC), ['paypal', 'revolut'])
    deepStrictEqual(getPaymentMethods(mopsD), ['paypal'])
  })
})


describe('getCurrencies', () => {
  it('gets all currencies defined in means of payment', () => {
    deepStrictEqual(getCurrencies(mopsA), ['EUR', 'CHF', 'GBP'])
    deepStrictEqual(getCurrencies(mopsB), ['EUR', 'CHF'])
    deepStrictEqual(getCurrencies(mopsC), ['EUR'])
    deepStrictEqual(getCurrencies(mopsD), ['EUR', 'CHF'])
  })
})


describe('paymentMethodAllowedForCurrency', () => {
  it('checks if payment method is allowed for a given rcurrency', () => {
    ok(paymentMethodAllowedForCurrency('sepa', 'EUR'))
    ok(paymentMethodAllowedForCurrency('sepa', 'CHF'))
    ok(paymentMethodAllowedForCurrency('sepa', 'GBP'))
    ok(!paymentMethodAllowedForCurrency('sepa', 'SEK'))
  })
})


