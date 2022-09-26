import { deepStrictEqual, strictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { getChat, popUnsentMessages, saveChat } from '../../../../src/utils/chat'
import { session } from '../../../../src/utils/session'
import * as chatData from '../../data/chatData'
import { resetFakeFiles } from '../../prepare'

session.password = 'supersecret'

describe('popUnsentMessages', () => {
  beforeEach(async () => {
    await setAccount({
      ...defaultAccount,
      publicKey: '0366497c46fef0ba126a42993ed0390c17b99eb1cc1285cef10e2496478ad709b4',
    })
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('gets and removes unsent messages from a chat', () => {
    saveChat(chatData.chatWithUnsentMessages.id, chatData.chatWithUnsentMessages)
    const unsentMessages = popUnsentMessages(chatData.chatWithUnsentMessages.id)
    deepStrictEqual(
      unsentMessages.map(m => m.message),
      ['Test', 'D'],
    )
    deepStrictEqual(
      unsentMessages.map(m => m.readBy.length),
      [0, 0],
    )

    const savedChat = getChat(chatData.chatWithUnsentMessages.id)
    strictEqual(savedChat.messages.length, 1)
  })
  it('returns an empty array for a non existing chat', () => {
    const unsentMessages = popUnsentMessages('doesntExist')
    strictEqual(unsentMessages.length, 0)
  })
})
