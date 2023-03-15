import { setAccount } from '../account'
import * as accountData from '../../../tests/unit/data/accountData'
import * as contractData from '../../../tests/unit/data/contractData'
import { resetStorage } from '../../../tests/unit/prepare'
import { initDisputeSystemMessages, endDisputeSystemMessages } from './createDisputeSystemMessages'

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
