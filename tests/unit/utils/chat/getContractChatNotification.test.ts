import { strictEqual } from 'assert'
import { getContractChatNotification } from '../../../../src/utils/chat'
import * as accountData from '../../data/accountData'

describe('getContractChatNotification', () => {
  it('get unread notifiactions', () => {
    strictEqual(getContractChatNotification(accountData.contract), 0)
  })
})
