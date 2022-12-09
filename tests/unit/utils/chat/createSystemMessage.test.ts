import { deepStrictEqual } from 'assert'
import { setAccount } from '../../../../src/utils/account'
import { createSystemMessage } from '../../../../src/utils/chat'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

describe('createSystemMessage', () => {
  beforeEach(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('creates a system message', () => {
    const now = new Date()
    const systemMessage = createSystemMessage('room-id', now, 'Test')
    deepStrictEqual(systemMessage, {
      roomId: 'room-id',
      from: 'system',
      date: now,
      readBy: [accountData.account1.publicKey],
      message: 'Test',
      signature: systemMessage.signature,
    })
  })
})
