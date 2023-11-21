import { deepStrictEqual } from 'assert'
import { mopsA, mopsB, mopsC, mopsD, mopsE, mopsF } from '../../../tests/unit/data/meansOfPaymentData'
import { getMoPsInCommon } from './getMoPsInCommon'

describe('getMoPsInCommon', () => {
  it('finds payment methods that both offers have in common', () => {
    deepStrictEqual(getMoPsInCommon(mopsA, mopsB), {
      EUR: ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsA, mopsC), {
      EUR: ['paypal', 'revolut'],
    })
    deepStrictEqual(getMoPsInCommon(mopsA, mopsD), {
      EUR: ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsB, mopsC), {
      EUR: ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsB, mopsD), {
      EUR: ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsC, mopsD), {
      EUR: ['paypal'],
    })
    deepStrictEqual(getMoPsInCommon(mopsE, mopsF), {
      EUR: ['sepa'],
    })
  })
})
