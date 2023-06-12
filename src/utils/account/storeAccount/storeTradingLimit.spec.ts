import { accountStorage } from '../accountStorage'
import { storeTradingLimit } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('storeTradingLimit', () => {
  it('would write file to store tradingLimit', () => {
    storeTradingLimit(accountData.account1.tradingLimit)
    expect(accountStorage.setMap).toHaveBeenCalledWith('tradingLimit', accountData.account1.tradingLimit)
  })
})
