import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeChats } from '../../../../../src/utils/account'
import { chatStorage } from '../../../../../src/utils/account/chatStorage'
import { loadChat } from '../../../../../src/utils/account/loadAccount'
import * as accountData from '../../../data/accountData'
import { resetStorage } from '../../../prepare'

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
