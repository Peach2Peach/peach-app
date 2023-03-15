import { accountStorage } from '../accountStorage'
import { storeTradingLimit } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

describe('storeTradingLimit', () => {
  afterEach(() => {
    resetStorage()
  })

  it('would write file to store tradingLimit', async () => {
    await storeTradingLimit(accountData.account1.tradingLimit)
    expect(accountStorage.setMap).toHaveBeenCalledWith('tradingLimit', accountData.account1.tradingLimit)
  })
})
