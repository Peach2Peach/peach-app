import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeTradingLimit } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storeTradingLimit', () => {
  let writeFileSpy: jest.SpyInstance

  beforeEach(async () => {
    writeFileSpy = jest.spyOn(fileUtils, 'writeFile')

    await setAccount(defaultAccount)
    await storeTradingLimit(defaultAccount.tradingLimit, password)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to store tradingLimit', async () => {
    await storeTradingLimit(accountData.account1.tradingLimit, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-tradingLimit.json',
      JSON.stringify(accountData.account1.tradingLimit),
      password,
    )
  })
})
