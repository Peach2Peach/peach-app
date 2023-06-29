import { checkUsedReferralCode } from './checkUsedReferralCode'
import { useSettingsStore } from '../../../store/useSettingsStore'
import { getSelfUser } from '../../../utils/peachAPI'

jest.mock('../../../utils/peachAPI', () => ({
  getSelfUser: jest.fn(),
}))

describe('checkUsedReferralCode', () => {
  afterEach(() => {
    jest.resetAllMocks()
    useSettingsStore.setState({ usedReferralCode: undefined })
  })
  it('should check if referral code has been used and set setting to true', async () => {
    ;(getSelfUser as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: 'SATOSHI',
      },
    ])
    await checkUsedReferralCode()
    expect(getSelfUser).toHaveBeenCalledWith({})
    expect(useSettingsStore.getState().usedReferralCode).toBe(true)
  })
  it('should check if referral code has been used and set setting to false if not used', async () => {
    ;(getSelfUser as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: undefined,
      },
    ])
    await checkUsedReferralCode()
    expect(getSelfUser).toHaveBeenCalledWith({})
    expect(useSettingsStore.getState().usedReferralCode).toBe(false)
  })
  it('should not check again', async () => {
    useSettingsStore.setState({ usedReferralCode: true })
    ;(getSelfUser as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: undefined,
      },
    ])
    await checkUsedReferralCode()
    expect(getSelfUser).not.toHaveBeenCalled()
  })
})
