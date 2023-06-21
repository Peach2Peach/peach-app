import { defaultAccount, setAccount } from '..'
import { accountStorage } from '../accountStorage'
import { storePaymentData } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('storePaymentData', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('would store paymentData', () => {
    storePaymentData(accountData.account1.paymentData)
    expect(accountStorage.setArray).toHaveBeenCalledWith('paymentData', accountData.account1.paymentData)
  })
})
