import { deepStrictEqual } from 'assert'
import { setAccount } from '../account'
import { createSystemMessage } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import { resetStorage } from '../../../tests/unit/prepare'

describe('createSystemMessage', () => {
  beforeEach(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetStorage()
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
