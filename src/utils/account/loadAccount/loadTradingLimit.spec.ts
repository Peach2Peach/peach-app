import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeTradingLimit } from '..'
import { loadTradingLimit } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

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
