import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { decryptMessage } from '../../../../src/utils/chat'
import * as chatData from '../../data/chatData'
import { resetStorage } from '../../prepare'

describe('decryptMessage', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
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
