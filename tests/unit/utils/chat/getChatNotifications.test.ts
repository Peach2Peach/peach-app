import { strictEqual } from 'assert'
import { setAccount } from '../../../../src/utils/account'
import { getChatNotifications } from '../../../../src/utils/chat'
import * as accountData from '../../data/accountData'

describe('getChatNotifications', () => {
  beforeEach(async () => {
    await setAccount(accountData.account1)
  })

  it('get unread notifiactions', () => {
    strictEqual(getChatNotifications(), 0)
  })
})
