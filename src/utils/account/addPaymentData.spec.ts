import { deepStrictEqual } from 'assert'
import { account, addPaymentData, defaultAccount, setAccount } from '.'
import * as accountData from '../../../tests/unit/data/accountData'

describe('addPaymentData', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
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
