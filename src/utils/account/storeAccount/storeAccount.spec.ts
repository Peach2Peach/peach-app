import { deepStrictEqual } from 'assert'
import { defaultAccount, loadChats, loadOffers, loadTradingLimit, setAccount, storeAccount } from '..'
import * as accountData from '../../../../tests/unit/data/accountData'
import { accountStorage } from '../accountStorage'

describe('storeAccount', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('would store whole account', async () => {
    await storeAccount(accountData.buyer)
    const identity = accountStorage.getMap('identity') as Identity
    const [tradingLimit, offers, chats] = await Promise.all([loadTradingLimit(), loadOffers(), loadChats()])
    deepStrictEqual(
      {
        ...identity,
        tradingLimit,
        offers,
        chats,
      },
      accountData.buyer,
    )
  })
})
