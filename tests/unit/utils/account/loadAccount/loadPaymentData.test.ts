import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

/**
 * @deprecated
 */
describe('loadPaymentData', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads payment data', async () => {
    await storeAccount(accountData.account1)

    const paymentData = undefined // await loadPaymentData()
    deepStrictEqual(paymentData, accountData.account1.paymentData)
  })
})
