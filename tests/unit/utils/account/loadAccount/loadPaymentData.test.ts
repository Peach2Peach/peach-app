import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadPaymentData } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

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
