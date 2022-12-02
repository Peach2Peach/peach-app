import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storePaymentData } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storePaymentData', () => {
  let writeFileSpy: jest.SpyInstance

  beforeEach(async () => {
    writeFileSpy = jest.spyOn(fileUtils, 'writeFile')

    await setAccount(defaultAccount)
    await storePaymentData(defaultAccount.paymentData, password)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to store paymentData', async () => {
    await storePaymentData(accountData.account1.paymentData, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-paymentData.json',
      JSON.stringify(accountData.account1.paymentData),
      password,
    )
  })
})
