import { strictEqual } from 'assert'
import { getContractChatNotification } from '.'
import * as contractData from '../../../tests/unit/data/contractData'

describe('getContractChatNotification', () => {
  it('get unread notifiactions', () => {
    strictEqual(getContractChatNotification(contractData.contract), 0)
  })
})
