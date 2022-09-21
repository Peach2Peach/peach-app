import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { storePaymentData } from '../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../src/utils/file'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('storePaymentData', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storePaymentData(defaultAccount.paymentData, password)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to store paymentData', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storePaymentData(accountData.account1.paymentData, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-paymentData.json',
      JSON.stringify(accountData.account1.paymentData),
      password,
    )
  })
})
