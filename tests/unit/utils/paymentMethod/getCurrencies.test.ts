import { deepStrictEqual } from 'assert'
import { getCurrencies } from '../../../../src/utils/paymentMethod'
import { mopsA, mopsB, mopsC, mopsD } from './paymentMethodData'

describe('getCurrencies', () => {
  it('gets all currencies defined in means of payment', () => {
    deepStrictEqual(getCurrencies(mopsA), ['EUR', 'CHF', 'GBP'])
    deepStrictEqual(getCurrencies(mopsB), ['EUR', 'CHF'])
    deepStrictEqual(getCurrencies(mopsC), ['EUR'])
    deepStrictEqual(getCurrencies(mopsD), ['EUR', 'CHF'])
  })
})
