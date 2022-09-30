import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadLegacyAccount } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { fakeFiles, resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

describe('loadLegacyAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('loads legacy account from file', async () => {
    const readFileSpy = jest.spyOn(file, 'readFile')

    fakeFiles['/peach-account.json'] = JSON.stringify(accountData.account1)

    const legacyAccount = await loadLegacyAccount(password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account.json', password)
    deepStrictEqual(legacyAccount, accountData.account1)
  })
})
