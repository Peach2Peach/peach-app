import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { storeChat } from '../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../src/utils/file'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('storeChat', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to store chats', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeChat(accountData.buyer.chats['313-312'], password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-chats/313-312.json',
      JSON.stringify(accountData.buyer.chats['313-312']),
      password,
    )
  })
})
