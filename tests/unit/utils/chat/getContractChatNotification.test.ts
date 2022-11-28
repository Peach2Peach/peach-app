import { strictEqual } from 'assert'
import { getContractChatNotification } from '../../../../src/utils/chat'
import * as contractData from '../../data/contractData'

describe('getContractChatNotification', () => {
  it('get unread notifiactions', () => {
    strictEqual(getContractChatNotification(contractData.contract), 0)
  })
})
