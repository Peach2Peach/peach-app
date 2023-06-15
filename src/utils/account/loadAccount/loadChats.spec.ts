import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeChats } from '..'
import { loadChats } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'

describe('loadChats', () => {
  beforeEach(() => {
    setAccount(defaultAccount)
  })
  it('loads all chats', async () => {
    await storeChats(accountData.buyer.chats)

    const chats = await loadChats()
    deepStrictEqual(chats, accountData.buyer.chats)
  })
})
