import { useSettingsStore } from '../../../store/settingsStore'
import { peachAPI } from '../../../utils/peachAPI'
import { checkUsedReferralCode } from './checkUsedReferralCode'

describe('checkUsedReferralCode', () => {
  afterEach(() => {
    jest.resetAllMocks()
    useSettingsStore.setState({ usedReferralCode: undefined })
  })
  it('should check if referral code has been used and set setting to true', async () => {
    peachAPI.private.user.getSelfUser.mockResolvedValue([
      {
        usedReferralCode: 'SATOSHI',
      },
    ])
    await checkUsedReferralCode()
    expect(peachAPI.private.user.getSelfUser).toHaveBeenCalledWith({})
    expect(useSettingsStore.getState().usedReferralCode).toBe(true)
  })
  it('should check if referral code has been used and set setting to false if not used', async () => {
    peachAPI.private.user.getSelfUser.mockResolvedValue([
      {
        usedReferralCode: undefined,
      },
    ])
    await checkUsedReferralCode()
    expect(peachAPI.private.user.getSelfUser).toHaveBeenCalledWith({})
    expect(useSettingsStore.getState().usedReferralCode).toBe(false)
  })
  it('should not check again', async () => {
    useSettingsStore.setState({ usedReferralCode: true })
    peachAPI.private.user.getSelfUser.mockResolvedValue([
      {
        usedReferralCode: undefined,
      },
    ])
    await checkUsedReferralCode()
    expect(peachAPI.private.user.getSelfUser).not.toHaveBeenCalled()
  })
})
