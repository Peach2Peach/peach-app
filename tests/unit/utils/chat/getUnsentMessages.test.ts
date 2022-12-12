import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { getUnsentMessages } from '../../../../src/utils/chat'
import * as chatData from '../../data/chatData'
import { resetFakeFiles } from '../../prepare'

describe('getUnsentMessages', () => {
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

  it('gets unsent messages from a chat', () => {
    const unsentMessages = getUnsentMessages(chatData.chatWithUnsentMessages.messages)
    deepStrictEqual(
      unsentMessages.map((m) => m.message),
      ['Test', 'D'],
    )
    deepStrictEqual(
      unsentMessages.map((m) => m.readBy.length),
      [0, 0],
    )
  })
})
