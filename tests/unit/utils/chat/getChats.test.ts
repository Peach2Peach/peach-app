import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { getChats, saveChat } from '../../../../src/utils/chat'
import { session } from '../../../../src/utils/session'
import * as chatData from '../../data/chatData'

session.password = 'supersecret'

describe('getChats', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })

  it('gets all chats on account', () => {
    saveChat(chatData.chat1.id, chatData.chat1)
    saveChat(chatData.chatWithDuplicate.id, chatData.chatWithDuplicate)
    saveChat(chatData.chatUnsorted.id, chatData.chatUnsorted)
    const chats = getChats()
    deepStrictEqual(
      chats.map(chat => chat.id),
      [chatData.chat1.id, chatData.chatWithDuplicate.id, chatData.chatUnsorted.id],
    )
    deepStrictEqual(
      chats.map(chat => chat.messages.length),
      [22, 2, 3],
    )
  })
})
