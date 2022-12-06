import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadSettings } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('loadSettings', () => {
  let readFileSpy: jest.SpyInstance

  beforeEach(async () => {
    readFileSpy = jest.spyOn(file, 'readFile')

    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    readFileSpy.mockClear()
  })

  it('loads settings from files', async () => {
    await storeAccount(accountData.account1, password)

    const settings = await loadSettings(password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-settings.json', password)
    deepStrictEqual(settings, accountData.account1.settings)
  })
})
