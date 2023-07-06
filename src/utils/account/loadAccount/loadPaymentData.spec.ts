import { deepStrictEqual } from 'assert'
import { loadPaymentData } from '.'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { accountStorage } from '../accountStorage'

describe('loadPaymentData', () => {
  it('loads payment data', async () => {
    accountStorage.setArray('paymentData', [validSEPAData])
    deepStrictEqual(loadPaymentData(), [validSEPAData])
  })
})
