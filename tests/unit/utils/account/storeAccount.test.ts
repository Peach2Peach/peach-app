import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { storeAccount } from '../../../../src/utils/account/'
import * as fileUtils from '../../../../src/utils/file'
import * as accountData from '../../data/accountData'
import { resetFakeFiles } from '../../prepare'

const password = 'supersecret'

describe('storeAccount', () => {
  beforeEach(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetFakeFiles()
    jest.clearAllMocks()
  })

  it('would write file to whole account', async () => {
    const writeFileSpy = jest.spyOn(fileUtils, 'writeFile')
    await storeAccount(accountData.account1, password)
    expect(writeFileSpy).toHaveBeenCalledTimes(8)
    expect(writeFileSpy).toHaveBeenCalledWith(expect.stringContaining('.json'), expect.stringContaining('{'), password)
  })
})
