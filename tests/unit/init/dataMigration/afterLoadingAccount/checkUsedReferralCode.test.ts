import { checkUsedReferralCode } from '../../../../../src/init/dataMigration/afterLoadingAccount/checkUsedReferralCode'
import { settingsStore } from '../../../../../src/store/settingsStore'
import { getUserPrivate } from '../../../../../src/utils/peachAPI'

jest.mock('../../../../../src/utils/peachAPI', () => ({
  getUserPrivate: jest.fn(),
}))

describe('checkUsedReferralCode', () => {
  afterEach(() => {
    jest.resetAllMocks()
    settingsStore.setState({ usedReferralCode: undefined })
  })
  it('should check if referral code has been used and set setting to true', async () => {
    ;(getUserPrivate as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: 'SATOSHI',
      },
    ])
    await checkUsedReferralCode('publicKey')
    expect(getUserPrivate).toHaveBeenCalledWith({ userId: 'publicKey' })
    expect(settingsStore.getState().usedReferralCode).toBe(true)
  })
  it('should check if referral code has been used and set setting to false if not used', async () => {
    ;(getUserPrivate as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: undefined,
      },
    ])
    await checkUsedReferralCode('publicKey')
    expect(getUserPrivate).toHaveBeenCalledWith({ userId: 'publicKey' })
    expect(settingsStore.getState().usedReferralCode).toBe(false)
  })
  it('should not check again', async () => {
    settingsStore.setState({ usedReferralCode: true })
    ;(getUserPrivate as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: undefined,
      },
    ])
    await checkUsedReferralCode('publicKey')
    expect(getUserPrivate).not.toHaveBeenCalled()
  })
})
