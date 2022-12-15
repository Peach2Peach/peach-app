import { deepStrictEqual, ok, strictEqual } from 'assert'
import { account, defaultAccount, setAccount } from '../../../../src/utils/account'
import { getChat, saveChat } from '../../../../src/utils/chat'
import * as chatData from '../../data/chatData'
import { resetStorage } from '../../prepare'

describe('getChat', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('gets a chat', () => {
    saveChat(chatData.chat1.id, chatData.chat1)
    const chat = getChat(chatData.chat1.id)
    deepStrictEqual(chat, chatData.chat1)
    deepStrictEqual(account.chats[chatData.chat1.id], chatData.chat1)
  })
  it('returns an empty chat for non existing chats', () => {
    const chat = getChat('doesntExist')
    strictEqual(chat.id, 'doesntExist')
    strictEqual(chat.messages.length, 0)
    ok(chat.lastSeen.getTime())
  })
})
