import { deepStrictEqual } from 'assert'
import { account, defaultAccount, setAccount, updatePaymentData } from '.'
import * as accountData from '../../../tests/unit/data/accountData'

describe('updatePaymentData', () => {
  beforeAll(() => {
    setAccount(defaultAccount)
  })

  it('updates account payment data', () => {
    updatePaymentData(accountData.paymentData)
    deepStrictEqual(account.paymentData, accountData.paymentData)
  })
})
