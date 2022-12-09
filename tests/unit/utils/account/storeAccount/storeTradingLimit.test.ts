import { accountStorage } from '../../../../../src/utils/account/accountStorage'
import { storeTradingLimit } from '../../../../../src/utils/account/storeAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('storeTradingLimit', () => {
  afterEach(() => {
    resetStorage()
  })

  it('would write file to store tradingLimit', async () => {
    await storeTradingLimit(accountData.account1.tradingLimit)
    expect(accountStorage.setMap).toHaveBeenCalledWith('tradingLimit', accountData.account1.tradingLimit)
  })
})
