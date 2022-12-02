import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeChat } from '../../../../../src/utils/account/storeAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storeChat', () => {
  let writeFileSpy: jest.SpyInstance

  beforeEach(async () => {
    writeFileSpy = jest.spyOn(file, 'writeFile')

    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to store chats', async () => {
    await storeChat(accountData.buyer.chats['313-312'], password)
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/peach-account-chats/313-312.json',
      JSON.stringify(accountData.buyer.chats['313-312']),
      password,
    )
  })
})
