import { deepStrictEqual } from 'assert'
import { account, defaultAccount, setAccount, updatePaymentData } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import { resetStorage } from '../../../tests/unit/prepare'

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
