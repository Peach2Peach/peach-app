import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeChats } from '../../../../../src/utils/account'
import { loadChats } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

describe('loadChats', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads all chats', async () => {
    await storeChats(accountData.buyer.chats)

    const chats = await loadChats()
    deepStrictEqual(chats, accountData.buyer.chats)
  })
})
