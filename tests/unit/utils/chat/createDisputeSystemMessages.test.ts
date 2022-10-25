import { setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'
import {
  initDisputeSystemMessages,
  endDisputeSystemMessages,
} from '../../../../src/utils/chat/createDisputeSystemMessages'

describe.skip('createDisputeSystemMessages', () => {
  beforeEach(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('creates a starting dispute system message', () => {
    const systemMessages = initDisputeSystemMessages('room-id', accountData.contract)
  })
  it('creates an ending dispute system message', () => {
    const systemMessages = endDisputeSystemMessages('room-id', accountData.contract)
  })
})
