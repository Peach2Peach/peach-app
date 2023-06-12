import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '..'
import { loadPaymentData } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadPaymentData', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('loads payment data', async () => {
    await storeAccount(accountData.account1)

    const paymentData = loadPaymentData()
    deepStrictEqual(paymentData, accountData.account1.paymentData)
  })
})
