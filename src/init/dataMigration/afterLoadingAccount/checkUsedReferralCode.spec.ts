import { checkUsedReferralCode } from './checkUsedReferralCode'
import { settingsStore } from '../../../store/settingsStore'
import { getSelfUser } from '../../../utils/peachAPI'

jest.mock('../../../utils/peachAPI', () => ({
  getSelfUser: jest.fn(),
}))

describe('checkUsedReferralCode', () => {
  afterEach(() => {
    jest.resetAllMocks()
    settingsStore.setState({ usedReferralCode: undefined })
  })
  it('should check if referral code has been used and set setting to true', async () => {
    ;(getSelfUser as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: 'SATOSHI',
      },
    ])
    await checkUsedReferralCode('publicKey')
    expect(getSelfUser).toHaveBeenCalledWith({})
    expect(settingsStore.getState().usedReferralCode).toBe(true)
  })
  it('should check if referral code has been used and set setting to false if not used', async () => {
    ;(getSelfUser as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: undefined,
      },
    ])
    await checkUsedReferralCode('publicKey')
    expect(getSelfUser).toHaveBeenCalledWith({})
    expect(settingsStore.getState().usedReferralCode).toBe(false)
  })
  it('should not check again', async () => {
    settingsStore.setState({ usedReferralCode: true })
    ;(getSelfUser as jest.Mock).mockResolvedValue([
      {
        usedReferralCode: undefined,
      },
    ])
    await checkUsedReferralCode('publicKey')
    expect(getSelfUser).not.toHaveBeenCalled()
  })
})
