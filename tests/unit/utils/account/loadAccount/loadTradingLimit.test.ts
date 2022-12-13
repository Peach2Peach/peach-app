import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeTradingLimit } from '../../../../../src/utils/account'
import { loadTradingLimit } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('loadTradingLimit', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads trading limit', async () => {
    await storeTradingLimit(accountData.account1.tradingLimit)

    const tradingLimit = await loadTradingLimit()
    deepStrictEqual(tradingLimit, accountData.account1.tradingLimit)
  })
})
