import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { storeTradingLimit } from '../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../src/utils/file'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('storeTradingLimit', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeTradingLimit(defaultAccount.tradingLimit, password)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to store tradingLimit', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeTradingLimit(accountData.account1.tradingLimit, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-tradingLimit.json',
      JSON.stringify(accountData.account1.tradingLimit),
      password,
    )
  })
})
