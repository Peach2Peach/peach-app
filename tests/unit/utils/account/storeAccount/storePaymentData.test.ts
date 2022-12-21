import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { accountStorage } from '../../../../../src/utils/account/accountStorage'
import { storePaymentData } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

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
