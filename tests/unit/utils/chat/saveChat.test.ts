import { deepStrictEqual, strictEqual } from 'assert'
import { account, defaultAccount, setAccount } from '../../../../src/utils/account'
import { saveChat } from '../../../../src/utils/chat'
import * as chatData from '../../data/chatData'
import { resetFakeFiles } from '../../prepare'
import { session } from '../../../../src/utils/session'

session.password = 'supersecret'

describe('saveChat', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('saves a new chat', () => {
    const savedChat = saveChat(chatData.chat1.id, chatData.chat1)
    deepStrictEqual(savedChat, chatData.chat1)
    deepStrictEqual(account.chats[chatData.chat1.id], chatData.chat1)
  })
  it('does not duplicate messages when overwriting existing chat', () => {
    saveChat(chatData.chat1.id, chatData.chat1)
    saveChat(chatData.chat1.id, chatData.chat1)
    strictEqual(account.chats[chatData.chat1.id].messages.length, 22)
  })
  it('removes duplicate messages', () => {
    const savedChat = saveChat(chatData.chatWithDuplicate.id, chatData.chatWithDuplicate)
    strictEqual(savedChat.messages.length, 2)
  })
  it('sorts message by date', () => {
    const savedChat = saveChat(chatData.chatUnsorted.id, chatData.chatUnsorted)
    deepStrictEqual(savedChat.messages[0].date, new Date('2022-09-14T16:15:17.000Z'))
    deepStrictEqual(savedChat.messages[1].date, new Date('2022-09-15T07:22:42.531Z'))
    deepStrictEqual(savedChat.messages[2].date, new Date('2022-09-15T07:53:14.346Z'))
  })
})
