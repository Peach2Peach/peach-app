import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { loadLegacyAccount } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { fakeFiles, resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('loadLegacyAccount', () => {
  let readFileSpy: jest.SpyInstance

  beforeEach(async () => {
    readFileSpy = jest.spyOn(file, 'readFile')
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    readFileSpy.mockClear()
  })

  it('loads legacy account from file', async () => {
    fakeFiles['/peach-account.json'] = JSON.stringify(accountData.account1)

    const legacyAccount = await loadLegacyAccount(password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account.json', password)
    deepStrictEqual(legacyAccount, accountData.account1)
  })
})
