import { deepStrictEqual } from 'assert'
import * as accountData from '../../../../tests/unit/data/accountData'
import { getIndexedMap } from '../../storage/getIndexedMap'
import { defaultAccount, setAccount } from '../account'
import { accountStorage } from '../accountStorage'
import { chatStorage } from '../chatStorage'
import { offerStorage } from '../offerStorage'
import { storeAccount } from '../storeAccount'

describe('storeAccount', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })

  it('would store whole account', async () => {
    await storeAccount(accountData.buyer)
    const identity = accountStorage.getMap('identity') as Identity
    const [tradingLimit, offers, chats] = await Promise.all([
      accountStorage.getMap('tradingLimit') || defaultAccount.tradingLimit,
      Object.values(await getIndexedMap(offerStorage)),
      getIndexedMap(chatStorage),
    ])
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
