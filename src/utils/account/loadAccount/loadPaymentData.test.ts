import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '.'
import { loadPaymentData } from './loadAccount'
import * as accountData from '../../../tests/unit/data/accountData'
import { resetStorage } from '../../../tests/unit/prepare'

describe('loadPaymentData', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads payment data', async () => {
    await storeAccount(accountData.account1)

    const paymentData = await loadPaymentData()
    deepStrictEqual(paymentData, accountData.account1.paymentData)
  })
})
