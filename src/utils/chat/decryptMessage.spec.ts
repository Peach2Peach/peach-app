import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../account'
import { decryptMessage } from '.'
import * as chatData from '../../../tests/unit/data/chatData'

describe('decryptMessage', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
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
