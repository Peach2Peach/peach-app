import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { loadTradingLimit } from '../../../../src/utils/account/loadAccount'
import { storeTradingLimit } from '../../../../src/utils/account/storeAccount'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadTradingLimit', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads trading limit', async () => {
    await storeTradingLimit(accountData.account1.tradingLimit, password)
    const tradingLimit = await loadTradingLimit(password)
    deepStrictEqual(tradingLimit, accountData.account1.tradingLimit)
  })
})
