import { deepStrictEqual } from 'assert'
import { account, addPaymentData, defaultAccount, setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetStorage } from '../../prepare'

describe('addPaymentData', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('adds new payment data to account', () => {
    addPaymentData(accountData.paymentData[0])
    addPaymentData(accountData.paymentData[1])
    deepStrictEqual(account.paymentData, accountData.paymentData)
  })
  it('updates payment data on account', () => {
    addPaymentData({
      ...accountData.paymentData[1],
      beneficiary: 'Hal',
    })
    deepStrictEqual(account.paymentData[1].beneficiary, 'Hal')
  })
})
