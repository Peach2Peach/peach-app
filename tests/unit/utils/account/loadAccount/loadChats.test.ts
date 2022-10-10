import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadChats } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { fakeFiles, resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('loadChats', () => {
  beforeEach(async () => {
    const existsMock = jest.spyOn(file, 'exists')
    const readDirMock = jest.spyOn(file, 'readDir')
    existsMock.mockImplementation(async (path) => path === '/peach-account-chats' || !!fakeFiles[path])
    readDirMock.mockImplementation(async (path) =>
      path === '/peach-account-chats' ? ['/peach-account-chats/313-312.json'] : [],
    )

    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads chats from files', async () => {
    const existsSpy = jest.spyOn(file, 'exists')
    const readFileSpy = jest.spyOn(file, 'readFile')

    await storeAccount(accountData.buyer, password)

    const chats = await loadChats(password)
    expect(existsSpy).toHaveBeenCalledWith('/peach-account-chats')
    expect(readFileSpy).toHaveBeenCalledTimes(1)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-chats/313-312.json', password)
    deepStrictEqual(chats, accountData.buyer.chats)
  })
})
