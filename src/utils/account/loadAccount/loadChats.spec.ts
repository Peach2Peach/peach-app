import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeChats } from '..'
import { loadChats } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

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
