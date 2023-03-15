import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeChats } from '..'
import { chatStorage } from '../chatStorage'
import { loadChat } from '.'
import * as accountData from '../../../../tests/unit/data/accountData'
import { resetStorage } from '../../../../tests/unit/prepare'

describe('loadChat', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetStorage()
  })

  it('loads chat', async () => {
    await storeChats(accountData.buyer.chats)

    const chat = await loadChat('313-312')
    expect(chatStorage.getMap).toHaveBeenCalledWith('313-312')
    deepStrictEqual(chat, accountData.buyer.chats['313-312'])
  })
})
