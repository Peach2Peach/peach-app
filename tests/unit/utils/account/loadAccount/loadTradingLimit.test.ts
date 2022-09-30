import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadTradingLimit } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('loadTradingLimit', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads trading limit from files', async () => {
    const readFileSpy = jest.spyOn(file, 'readFile')

    await storeAccount(accountData.account1, password)

    const tradingLimit = await loadTradingLimit(password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-tradingLimit.json', password)
    deepStrictEqual(tradingLimit, accountData.account1.tradingLimit)
  })
})
