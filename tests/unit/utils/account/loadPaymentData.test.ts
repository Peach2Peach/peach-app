import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { loadPaymentData } from '../../../../src/utils/account/loadAccount'
import { storePaymentData } from '../../../../src/utils/account/storeAccount'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadPaymentData', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads payment data', async () => {
    await storePaymentData(accountData.account1.paymentData, password)
    const paymentData = await loadPaymentData(password)
    deepStrictEqual(paymentData, accountData.account1.paymentData)
  })
})
