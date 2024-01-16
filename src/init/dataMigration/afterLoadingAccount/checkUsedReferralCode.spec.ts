import { responseUtils } from 'test-utils'
import { defaultUser } from '../../../../peach-api/src/testData/user'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import { peachAPI } from '../../../utils/peachAPI'
import { checkUsedReferralCode } from './checkUsedReferralCode'

const getSelfUserMock = jest.spyOn(peachAPI.private.user, 'getSelfUser')

describe('checkUsedReferralCode', () => {
  beforeEach(() => {
    useSettingsStore.setState({ usedReferralCode: undefined })
  })
  it('should check if referral code has been used and set setting to true', async () => {
    await checkUsedReferralCode()
    expect(getSelfUserMock).toHaveBeenCalled()
    expect(useSettingsStore.getState().usedReferralCode).toBe(true)
  })
  it('should check if referral code has been used and set setting to false if not used', async () => {
    getSelfUserMock.mockResolvedValue({
      result: {
        ...defaultUser,
        usedReferralCode: undefined,
      },
      error: undefined,
      ...responseUtils,
    })
    await checkUsedReferralCode()
    expect(getSelfUserMock).toHaveBeenCalled()
    expect(useSettingsStore.getState().usedReferralCode).toBe(false)
  })
  it('should not check again', async () => {
    useSettingsStore.setState({ usedReferralCode: true })
    getSelfUserMock.mockResolvedValue({
      result: {
        ...defaultUser,
        usedReferralCode: undefined,
      },
      error: undefined,
      ...responseUtils,
    })
    await checkUsedReferralCode()
    expect(getSelfUserMock).not.toHaveBeenCalled()
  })
})
