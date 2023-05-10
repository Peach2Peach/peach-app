import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeTradingLimit } from '..'
import { loadTradingLimit } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadTradingLimit', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })

  it('loads trading limit', async () => {
    await storeTradingLimit(accountData.account1.tradingLimit)

    const tradingLimit = await loadTradingLimit()
    deepStrictEqual(tradingLimit, accountData.account1.tradingLimit)
  })
})
