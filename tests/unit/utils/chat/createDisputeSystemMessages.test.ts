import { setAccount } from '../../../../src/utils/account'
import { createDisputeSystemMessages } from '../../../../src/utils/chat'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

describe.skip('createDisputeSystemMessages', () => {
  beforeEach(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('creates a dispute system message', () => {
    const systemMessages = createDisputeSystemMessages('room-id', accountData.contract)
  })
})
