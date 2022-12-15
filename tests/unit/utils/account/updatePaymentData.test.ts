import { deepStrictEqual } from 'assert'
import { account, defaultAccount, setAccount, updatePaymentData } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetStorage } from '../../prepare'

describe('updatePaymentData', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('updates account payment data', () => {
    updatePaymentData(accountData.paymentData)
    deepStrictEqual(account.paymentData, accountData.paymentData)
  })
})
