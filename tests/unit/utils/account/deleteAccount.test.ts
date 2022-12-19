import { deleteAccount, setAccount } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'
import { resetStorage } from '../../prepare'

describe('deleteAccount', () => {
  const onSuccess = jest.fn()

  beforeAll(async () => {
    await setAccount(accountData.account1)
  })
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('would delete account file', async () => {
    await deleteAccount({ onSuccess })
    expect(onSuccess).toBeCalled()
  })
})
