import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { loadChats } from '../../../../src/utils/account/loadAccount'
import { storeChats } from '../../../../src/utils/account/storeAccount'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('loadChats', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads chats', async () => {
    await storeChats(accountData.account1.chats, password)
    const chats = await loadChats(password)
    deepStrictEqual(chats, accountData.account1.chats)
  })
})
