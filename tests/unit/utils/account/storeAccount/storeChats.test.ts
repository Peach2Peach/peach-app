import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeChats } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storeChats', () => {
  let writeFileSpy: jest.SpyInstance

  beforeEach(async () => {
    writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await setAccount(defaultAccount)
    await storeChats(defaultAccount.chats, password)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to store chats', async () => {
    await storeChats(accountData.buyer.chats, password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-chats/313-312.json',
      JSON.stringify(accountData.buyer.chats['313-312']),
      password,
    )
  })
})
