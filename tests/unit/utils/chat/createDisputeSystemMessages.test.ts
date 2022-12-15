import { setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import * as contractData from '../../data/contractData'
import { resetStorage } from '../../prepare'
import {
  initDisputeSystemMessages,
  endDisputeSystemMessages,
} from '../../../../src/utils/chat/createDisputeSystemMessages'

describe.skip('createDisputeSystemMessages', () => {
  beforeEach(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('creates a starting dispute system message', () => {
    const systemMessages = initDisputeSystemMessages('room-id', contractData.contract)
  })
  it('creates an ending dispute system message', () => {
    const systemMessages = endDisputeSystemMessages('room-id', contractData.contract)
  })
})
