import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeChats } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('storeChats', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
    await storeChats(defaultAccount.chats, password)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to store chats', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeChats(accountData.buyer.chats, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-chats/313-312.json',
      JSON.stringify(accountData.buyer.chats['313-312']),
      password,
    )
  })
})
