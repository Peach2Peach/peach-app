import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeTradingLimit } from '..'
import { loadTradingLimit } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadTradingLimit', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('loads trading limit', () => {
    storeTradingLimit(accountData.account1.tradingLimit)

    const tradingLimit = loadTradingLimit()
    deepStrictEqual(tradingLimit, accountData.account1.tradingLimit)
  })
})
