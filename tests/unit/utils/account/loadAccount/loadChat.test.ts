import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadChat } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('loadChat', () => {
  let existsSpy: jest.SpyInstance
  let readFileSpy: jest.SpyInstance

  beforeEach(async () => {
    existsSpy = jest.spyOn(file, 'exists')
    readFileSpy = jest.spyOn(file, 'readFile')
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    existsSpy.mockClear()
    readFileSpy.mockClear()
  })

  it('load chat from file', async () => {
    await storeAccount(accountData.buyer, password)

    const chat = await loadChat('313-312', password)
    expect(existsSpy).toHaveBeenCalledWith('/peach-account-chats/313-312.json')
    expect(readFileSpy).toHaveBeenCalledTimes(1)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-chats/313-312.json', password)
    deepStrictEqual(chat, accountData.buyer.chats['313-312'])
  })
})
