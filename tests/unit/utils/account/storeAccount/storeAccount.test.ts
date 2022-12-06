import { defaultAccount, setAccount } from '../../../../../src/utils/account'
import { storeAccount } from '../../../../../src/utils/account/storeAccount'
import * as fileUtils from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('storeAccount', () => {
  let writeFileSpy: jest.SpyInstance

  beforeEach(async () => {
    writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    writeFileSpy.mockClear()
  })

  it('would write file to whole account', async () => {
    await storeAccount(accountData.buyer, password)
    expect(writeFileSpy).toHaveBeenCalledTimes(8)
    expect(writeFileSpy).toHaveBeenCalledWith(expect.stringContaining('.json'), expect.stringContaining('{'), password)
  })
})
