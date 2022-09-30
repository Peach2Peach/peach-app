import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadChat } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('loadChat', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('load chat from file', async () => {
    const existsSpy = jest.spyOn(file, 'exists')
    const readFileSpy = jest.spyOn(file, 'readFile')

    await storeAccount(accountData.buyer, password)

    const chat = await loadChat('313-312', password)
    expect(existsSpy).toHaveBeenCalledWith('/peach-account-chats/313-312.json')
    expect(readFileSpy).toHaveBeenCalledTimes(1)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-chats/313-312.json', password)
    deepStrictEqual(chat, accountData.buyer.chats['313-312'])
  })
})
