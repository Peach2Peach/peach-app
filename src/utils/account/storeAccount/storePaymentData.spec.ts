import { defaultAccount, setAccount } from '..'
import { accountStorage } from '../accountStorage'
import { storePaymentData } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

describe('storePaymentData', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
  })

  it('would store paymentData', async () => {
    await storePaymentData(accountData.account1.paymentData)
    expect(accountStorage.setArray).toHaveBeenCalledWith('paymentData', accountData.account1.paymentData)
  })
})
