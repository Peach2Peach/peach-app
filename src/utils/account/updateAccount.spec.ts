import { account1 } from '../../../tests/unit/data/accountData'
import { tradingLimit } from '../../../tests/unit/data/tradingLimitsData'
import { getPeachAccount } from '../peachAPI/peachAccount'
import { getWallet } from '../wallet'
import { account, defaultAccount } from './account'
import { updateAccount } from './updateAccount'

describe('updateAccount', () => {
  it('sets an account, sets wallet and peachAccount', async () => {
    await updateAccount(account1)
    expect(account).toEqual(account1)
    expect(getWallet()).toBeDefined()
    expect(getPeachAccount()).toBeDefined()
  })
  it('overwrites an account', async () => {
    await updateAccount({ ...account1, tradingLimit }, true)
    expect(account.tradingLimit).toEqual(tradingLimit)
  })
  it('merges an account with update', async () => {
    await updateAccount({ ...account1, tradingLimit })
    expect(account.tradingLimit).toEqual(defaultAccount.tradingLimit)
  })
})
