import { checkUsedReferralCode } from '../../../../../src/init/dataMigration/afterLoadingAccount/checkUsedReferralCode'
import { settingsStore } from '../../../../../src/store/settingsStore'
import { setAccount } from '../../../../../src/utils/account'
import { getUserPrivate } from '../../../../../src/utils/peachAPI'
import * as accountData from '../../../data/accountData'

jest.mock('../../../../../src/utils/peachAPI', () => ({
  getUserPrivate: jest.fn(),
}))

describe('checkUsedReferralCode', () => {
  beforeEach(() => {
    settingsStore.getState().usedReferralCode = undefined
    setAccount(accountData.account1)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should not call getUserPrivate if usedReferralCode is defined', async () => {
    settingsStore.getState().usedReferralCode = true

    await checkUsedReferralCode('publicKey')

    expect(getUserPrivate).not.toHaveBeenCalled()
  })

  it('should call getUserPrivate if usedReferralCode is undefined', async () => {
    const user = { usedReferralCode: 'TEST' }
    getUserPrivate.mockResolvedValue([user])

    await checkUsedReferralCode('publicKey')

    expect(getUserPrivate).toHaveBeenCalledWith({ userId: 'publicKey' })
    expect(settingsStore.getState().usedReferralCode).toEqual(true)
  })

  it('should set usedReferralCode to false if user.usedReferralCode is falsy', async () => {
    const user = {}
    getUserPrivate.mockResolvedValue([user])

    await checkUsedReferralCode('publicKey')

    expect(settingsStore.getState().usedReferralCode).toEqual(false)
  })

  it('should set usedReferralCode to true if user.usedReferralCode is truthy', async () => {
    const user = { usedReferralCode: 'TEST' }
    getUserPrivate.mockResolvedValue([user])

    await checkUsedReferralCode('publicKey')

    expect(settingsStore.getState().usedReferralCode).toEqual(true)
  })

  it('should not set usedReferralCode if getUserPrivate returns an empty array', async () => {
    getUserPrivate.mockResolvedValue([])

    await checkUsedReferralCode('publicKey')

    expect(settingsStore.getState().usedReferralCode).toBeUndefined()
  })

  it('should throw an error if getUserPrivate throws an error', async () => {
    const errorMessage = 'Something went wrong'
    getUserPrivate.mockRejectedValue(new Error(errorMessage))

    await expect(checkUsedReferralCode('publicKey')).rejects.toThrow(errorMessage)
  })
})
