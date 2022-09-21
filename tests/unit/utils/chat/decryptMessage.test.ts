import { deepStrictEqual } from 'assert'
import { account, defaultAccount, setAccount } from '../../../../src/utils/account'
import { decryptMessage } from '../../../../src/utils/chat'
import { session } from '../../../../src/utils/session'
import * as chatData from '../../data/chatData'
import { resetFakeFiles } from '../../prepare'

session.password = 'supersecret'

describe('decryptMessage', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  // TODO test actual decryption
  it.skip('decrypts messages', async () => {
    const decrypted = await Promise.all(chatData.chat1.messages.map(decryptMessage(chatData.chat1, 'symKey')))
    deepStrictEqual(decrypted, chatData.chat1.messages)
  })

  it('takes already decrypted message', async () => {
    const decrypted = await Promise.all(chatData.chat1.messages.map(decryptMessage(chatData.chat1, 'symKey')))
    deepStrictEqual(decrypted, chatData.chat1.messages)
  })
})
