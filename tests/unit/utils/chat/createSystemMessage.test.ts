import { deepStrictEqual } from 'assert'
import { setAccount } from '../../../../src/utils/account'
import { createSystemMessage } from '../../../../src/utils/chat'
import { session } from '../../../../src/utils/session'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

session.password = 'supersecret'

describe('createSystemMessage', () => {
  beforeEach(async () => {
    jest.mock('Date', () => ({
      now: () => 190000000,
    }))
    jest.mock('Math', () => ({
      random: () => 0.5,
    }))
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
      signature: 190000000 * 0.5,
    })
  })
})
